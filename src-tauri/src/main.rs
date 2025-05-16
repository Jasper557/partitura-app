// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant};
use tiny_http::{Server, Response, Method, Header};
use url::form_urlencoded;
use std::io::Read;
use std::fs::File;
use std::path::Path;

// State to store the authentication code received by the server
struct AuthState {
    code: Option<String>,
    received: bool,
}

static AUTH_STATE: once_cell::sync::Lazy<Arc<Mutex<AuthState>>> = once_cell::sync::Lazy::new(|| {
    Arc::new(Mutex::new(AuthState {
        code: None,
        received: false,
    }))
});

// Use a fixed port for the callback server to match redirect URLs in OAuth providers
const AUTH_CALLBACK_PORT: u16 = 43123;

#[tauri::command]
fn open_url_in_browser(url: String) -> Result<(), String> {
    println!("Opening URL in browser: {}", url);
    open::that(&url).map_err(|e| {
        println!("Failed to open URL: {}", e);
        e.to_string()
    })
}

#[tauri::command]
fn get_free_port() -> u16 {
    println!("get_free_port called, returning fixed port: {}", AUTH_CALLBACK_PORT);
    // For backward compatibility, but we're now using a fixed port
    AUTH_CALLBACK_PORT
}

// Function to serve the icon file
fn serve_icon() -> Response<std::io::Cursor<Vec<u8>>> {
    // First try to load from the bundled resources (for production)
    let icon_data = include_bytes!("../icons/icon.png");
    
    Response::from_data(icon_data.to_vec())
        .with_header(Header {
            field: "Content-Type".parse().unwrap(),
            value: "image/png".parse().unwrap(),
        })
}

#[tauri::command]
async fn listen_for_auth_callback(port: u16, timeout: u64) -> Result<String, String> {
    // Ensure we use the fixed port regardless of what was passed
    let actual_port = AUTH_CALLBACK_PORT;
    println!("listen_for_auth_callback called with port {}, using fixed port: {}", port, actual_port);
    let addr = format!("127.0.0.1:{}", actual_port);
    
    println!("Starting auth callback server on fixed port: {}", actual_port);
    
    // Try to bind to the port
    let server = match Server::http(&addr) {
        Ok(server) => server,
        Err(e) => {
            let error_msg = format!("Failed to start server on {}: {}", addr, e);
            println!("{}", error_msg);
            return Err(error_msg);
        }
    };
    
    println!("Auth callback server started on {}", addr);
    
    {
        let mut state = AUTH_STATE.lock().unwrap();
        state.received = false;
        state.code = None;
    }
    
    let state_clone = Arc::clone(&AUTH_STATE);
    let server = Arc::new(server);
    let server_clone = Arc::clone(&server);
    
    thread::spawn(move || {
        let start_time = Instant::now();
        let timeout_duration = Duration::from_secs(timeout);
        
        while start_time.elapsed() < timeout_duration {
            {
                let state = state_clone.lock().unwrap();
                if state.received {
                    println!("Auth code already received, stopping server");
                    break;
                }
            }
            
            match server_clone.recv_timeout(Duration::from_secs(1)) {
                Ok(Some(mut request)) => {
                    println!("Received request: {} {}", request.method(), request.url());
                    
                    // Try to get the raw request content if any
                    let mut content = String::new();
                    match request.body_length() {
                        Some(length) if length > 0 => {
                            let mut reader = request.as_reader();
                            if let Ok(size) = reader.read_to_string(&mut content) {
                                println!("Request body content ({} bytes): {}", size, content);
                            }
                        },
                        _ => {}
                    }
                    
                    let mut response = Response::from_string("Invalid request")
                        .with_status_code(400); // Default fallback response
                    
                    // Check if this is a request for the icon
                    if request.url().starts_with("/icon.png") && request.method() == &Method::Get {
                        response = serve_icon();
                    }
                    // Handle auth-callback requests 
                    else if request.url().starts_with("/auth-callback") && request.method() == &Method::Get {
                        let full_url = format!("http://localhost:{}{}", actual_port, request.url());
                        println!("Auth callback full URL: {}", full_url);
                        
                        // Extract and log all headers for debugging
                        println!("Request headers:");
                        for header in request.headers() {
                            println!("  {}: {}", header.field.as_str(), header.value.as_str());
                        }
                        
                        // Check for URL fragment directly in the URL (may not be present in headers)
                        let uri = request.url();
                        println!("Auth callback URI path: {}", uri);
                        
                        // Check for fragment or query parameters
                        if uri.contains("#") {
                            println!("Found # in URL, extracting fragment");
                            // Parse the fragment part (after #)
                            let fragment = uri.split('#').nth(1).unwrap_or("");
                            println!("Auth fragment: {}", fragment);
                            
                            // Parse the fragment
                            for (key, value) in form_urlencoded::parse(fragment.as_bytes()) {
                                println!("Fragment param: {} = {}", key, value);
                                if key == "access_token" {
                                    println!("Found access token in fragment: {}", value);
                                    
                                    let mut state = state_clone.lock().unwrap();
                                    state.code = Some(value.to_string());
                                    state.received = true;
                                    
                                    response = create_success_response();
                                    break;
                                }
                            }
                        } else {
                            println!("No fragment found in URL");
                        }
                        
                        // Try to get hash fragment from referrer header if available
                        let referrer = request.headers().iter()
                            .find(|h| h.field.as_str().to_ascii_lowercase() == "referer")
                            .map(|h| h.value.as_str());
                            
                        if let Some(ref_url) = referrer {
                            println!("Found referrer: {}", ref_url);
                            if ref_url.contains("#") {
                                let fragment = ref_url.split('#').nth(1).unwrap_or("");
                                println!("Referrer fragment: {}", fragment);
                                
                                // Parse the fragment from referrer
                                for (key, value) in form_urlencoded::parse(fragment.as_bytes()) {
                                    println!("Referrer fragment param: {} = {}", key, value);
                                    if key == "access_token" {
                                        println!("Found access token in referrer: {}", value);
                                        
                                        let mut state = state_clone.lock().unwrap();
                                        state.code = Some(value.to_string());
                                        state.received = true;
                                        
                                        response = create_success_response();
                                        break;
                                    }
                                }
                            }
                        }
                        
                        // Also check for code in query parameters
                        let query = uri.split('?').nth(1).unwrap_or("");
                        println!("Query string: {}", query);
                        
                        for (key, value) in form_urlencoded::parse(query.as_bytes()) {
                            println!("Query param: {} = {}", key, value);
                            if key == "code" || key == "access_token" {
                                println!("Found auth code/token in query param: {}", value);
                                
                                let mut state = state_clone.lock().unwrap();
                                state.code = Some(value.to_string());
                                state.received = true;
                                
                                response = create_success_response();
                                break;
                            }
                        }
                    }
                    
                    // Always serve the success page for auth-callback URLs to handle the token with JS
                    if request.url().starts_with("/auth-callback") {
                        response = create_success_response();
                    }
                    
                    // respond only once per request
                    if let Err(e) = request.respond(response) {
                        println!("Failed to send response: {}", e);
                    }
                }
                Ok(None) => {
                    thread::sleep(Duration::from_millis(100));
                }
                Err(e) => {
                    println!("Error receiving request: {}", e);
                    break;
                }
            }
        }
        
        println!("Auth callback server stopped");
    });
    
    let start_time = Instant::now();
    let timeout_duration = Duration::from_secs(timeout);
    
    while start_time.elapsed() < timeout_duration {
        let code = {
            let state = AUTH_STATE.lock().unwrap();
            state.code.clone()
        };
        
        if let Some(code) = code {
            println!("Returning auth code/token to application");
            return Ok(code);
        }
        
        tokio::time::sleep(Duration::from_millis(100)).await;
    }
    
    println!("Timeout waiting for authentication callback");
    Err("Timeout waiting for authentication callback".into())
}

fn create_success_response() -> Response<std::io::Cursor<Vec<u8>>> {
    let success_html = r#"
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Partitura - Authentication</title>
        <style>
            :root {
                /* Brand colors from logo */
                --blue: #4F95FF;
                --green: #7ED957;
                --orange: #FFC057;
                
                /* UI colors */
                --blue-dark: #3B82F6;
                --green-dark: #10B981;
                --orange-dark: #F59E0B;
                
                /* Background colors */
                --dark-bg: #111827;
                --dark-card: #1F2937;
                
                /* Text colors */
                --light-text: #F9FAFB;
                --muted-text: #9CA3AF;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            body {
                background-color: var(--dark-bg);
                color: var(--light-text);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                padding: 2rem;
                transition: all 0.3s ease;
                position: relative;
                overflow-x: hidden;
            }
            
            .bg-shape {
                position: absolute;
                border-radius: 50%;
                filter: blur(80px);
                opacity: 0.2;
                z-index: 0;
            }
            
            .shape-blue {
                background-color: var(--blue);
                width: 300px;
                height: 300px;
                top: -100px;
                left: -150px;
            }
            
            .shape-green {
                background-color: var(--green);
                width: 250px;
                height: 250px;
                bottom: -100px;
                right: -100px;
            }
            
            .shape-orange {
                background-color: var(--orange);
                width: 200px;
                height: 200px;
                bottom: 50px;
                left: 10%;
            }
            
            .card {
                background-color: var(--dark-card);
                border-radius: 1.5rem;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                padding: 2.5rem;
                width: 100%;
                max-width: 480px;
                text-align: center;
                transition: all 0.3s ease;
                position: relative;
                z-index: 10;
                border: 1px solid rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
            }
            
            .logo-container {
                position: relative;
                width: 120px;
                height: 120px;
                margin: 0 auto 2rem;
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(145deg, rgba(31, 41, 55, 0.5), rgba(17, 24, 39, 0.8));
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                transition: all 0.3s ease;
                overflow: hidden;
            }
            
            .logo-container::before,
            .logo-container::after {
                content: '';
                position: absolute;
                border-radius: 50%;
                transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                z-index: 0;
            }
            
            .logo-container::before {
                background: var(--blue);
                width: 32px;
                height: 32px;
                top: -5px;
                left: -5px;
                opacity: 0.6;
            }
            
            .logo-container::after {
                background: var(--green);
                width: 24px;
                height: 24px;
                bottom: -5px;
                right: -5px;
                opacity: 0.6;
            }
            
            .logo-container:hover::before {
                transform: scale(1.2) translate(5px, 5px);
            }
            
            .logo-container:hover::after {
                transform: scale(1.2) translate(-5px, -5px);
            }
            
            .logo {
                width: 80px;
                height: 80px;
                object-fit: contain;
                position: relative;
                z-index: 2;
                transition: all 0.3s ease;
            }
            
            .logo-container:hover .logo {
                transform: scale(1.05);
            }
            
            h1 {
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 1rem;
                background: linear-gradient(to right, var(--blue), var(--green));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                transition: all 0.3s ease;
            }
            
            p {
                font-size: 1.125rem;
                line-height: 1.6;
                color: var(--muted-text);
                transition: all 0.3s ease;
            }
            
            .success-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                height: 50px;
                margin: 0 auto 1.5rem;
                border-radius: 50%;
                background-color: var(--green-dark);
                color: white;
                font-size: 1.75rem;
                animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.1);
            }
            
            @keyframes scaleIn {
                0% { transform: scale(0); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
        </style>
        <script>
            window.onload = function() {
                // Try to parse the fragment from the URL
                const hash = window.location.hash.substring(1);
                const params = new URLSearchParams(hash);
                const accessToken = params.get('access_token');
                
                // Also check query parameters
                const urlParams = new URLSearchParams(window.location.search);
                const queryToken = urlParams.get('access_token');
                
                // Use either token source
                const token = accessToken || queryToken;
                
                if (token) {
                    // Automatically send the token back to the local server
                    fetch('/auth-callback?access_token=' + encodeURIComponent(token))
                        .then(response => {
                            if (response.ok) {
                                // Auto-close the window after a short delay
                                setTimeout(function() {
                                    window.close();
                                }, 2000);
                            }
                        })
                        .catch(err => {
                            console.error('Error during authentication:', err);
                        });
                }
            };
        </script>
    </head>
    <body>
        <div class="bg-shape shape-blue"></div>
        <div class="bg-shape shape-green"></div>
        <div class="bg-shape shape-orange"></div>
        
        <div class="card">
            <div class="logo-container">
                <img src="/icon.png" alt="Partitura Logo" class="logo"/>
            </div>
            
            <div class="success-icon">✓</div>
            
            <h1>Authentication Successful</h1>
            
            <p>You have successfully authenticated with Partitura.</p>
        </div>
    </body>
    </html>
    "#;
    
    Response::from_string(success_html)
        .with_header(Header {
            field: "Content-Type".parse().unwrap(),
            value: "text/html".parse().unwrap(),
        })
}

fn main() {
    println!("Starting Partitura application...");
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_free_port,
            listen_for_auth_callback,
            open_url_in_browser
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
