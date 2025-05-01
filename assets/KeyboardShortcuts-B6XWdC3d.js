import{j as e,V as k,K as C,h as P,a1 as z,R as M,P as $,e as R,k as b}from"./ui-DgCwhHkT.js";import{r as h}from"./react-C14kkwO6.js";import{a as T,u as D,D as K}from"./index-CFOCruvU.js";import{I as f}from"./InfoBox-DNiEcY11.js";import{u as I}from"./useScrollReset-ZRr5ZJk0.js";import{P as O}from"./PageTransition-BFnjTUrs.js";import"./supabase-D5PNQMqt.js";const A={closeDialog:"Close Dialog / Modal",tabNavigation:"Navigate Between Elements",search:"Search In Collection",addNew:"Add New Sheet Music",previousPage:"Previous Page",nextPage:"Next Page",zoomIn:"Zoom In",zoomOut:"Zoom Out",toggleFullscreen:"Toggle Fullscreen Mode"},_=({onNavigate:g})=>{const{isDarkMode:o}=T(),{shortcuts:c,updateShortcuts:m}=D(),[s,d]=h.useState(null),[x,l]=h.useState(""),p=h.useRef(null);I();const y=(t,a)=>{d({category:t,action:a}),l("")},v=()=>{localStorage.setItem("shortcuts",JSON.stringify(c)),l("Shortcuts saved successfully!"),setTimeout(()=>l(""),3e3)},j=()=>{m(K),localStorage.removeItem("shortcuts"),l("Shortcuts reset to defaults!"),setTimeout(()=>l(""),3e3)},S=t=>{if(t.preventDefault(),!s)return;const{category:a,action:i}=s;let r="";if((t.ctrlKey||t.metaKey)&&(r+="Ctrl + "),t.altKey&&(r+="Alt + "),t.shiftKey&&(r+="Shift + "),t.key===" ")r+="Space";else{if(t.key==="Control"||t.key==="Alt"||t.key==="Shift"||t.key==="Meta")return;r+=t.key.length===1?t.key.toUpperCase():t.key}const n={...c};a==="general"?n.general[i]=r:a==="sheetMusic"?n.sheetMusic[i]=r:a==="pdfViewer"&&(n.pdfViewer[i]=r),m(n),d(null)},w=(t,a,i)=>e.jsxs("div",{className:"mb-8",children:[e.jsxs("h2",{className:`
          text-lg font-semibold mb-4 flex items-center gap-2
          ${o?"text-gray-200":"text-gray-800"}
        `,children:[i,a]}),e.jsx("div",{className:`rounded-lg ${o?"bg-gray-800":"bg-white"} overflow-hidden`,children:Object.entries(c[t]).map(([r,n])=>e.jsxs("div",{className:`
                p-4 flex items-center justify-between
                ${o?"border-gray-700":"border-gray-200"}
                border-b last:border-0
              `,children:[e.jsx("div",{children:e.jsx("h3",{className:`font-medium ${o?"text-gray-200":"text-gray-800"}`,children:A[r]||r})}),e.jsx("div",{className:"flex items-center gap-2",children:e.jsxs("button",{onClick:()=>y(t,r),className:`
                    px-4 py-1.5 rounded text-sm font-medium relative
                    transition-all duration-300 ease-in-out 
                    overflow-hidden group
                    ${(s==null?void 0:s.category)===t&&(s==null?void 0:s.action)===r?o?"bg-blue-600 text-white animate-pulse":"bg-blue-500 text-white animate-pulse":o?"bg-gray-700 text-gray-300 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-600":"bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400"}
                  `,children:[e.jsx("span",{className:"absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out",style:{clipPath:"circle(0% at 50% 50%)",transition:"clip-path 0.5s ease-in-out"},onMouseOver:u=>{u.currentTarget.style.clipPath="circle(100% at 50% 50%)"},onMouseOut:u=>{u.currentTarget.style.clipPath="circle(0% at 50% 50%)"}}),e.jsx("span",{className:`
                    relative z-10 inline-block w-full text-center
                    transition-all duration-300 ease-in-out
                    group-hover:blur-sm group-hover:opacity-60 group-hover:scale-90
                    ${(s==null?void 0:s.category)===t&&(s==null?void 0:s.action)===r?"":"group-hover:text-white"}
                  `,children:(s==null?void 0:s.category)===t&&(s==null?void 0:s.action)===r?"Press new shortcut...":n}),e.jsx($,{size:18,className:`
                      absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      opacity-0 group-hover:opacity-100
                      scale-0 group-hover:scale-110
                      transition-all duration-300 ease-in-out
                      text-white filter drop-shadow-glow
                      group-hover:animate-pulse
                    `})]})})]},`${t}-${r}`))})]}),N={general:{title:"General Navigation",icon:e.jsx(R,{size:18})},sheetMusic:{title:"Sheet Music Library",icon:e.jsx(b,{size:18})},pdfViewer:{title:"PDF Viewer Controls",icon:e.jsx(b,{size:18})}};return e.jsx(O,{children:e.jsx("div",{ref:p,onKeyDown:S,tabIndex:0,className:`
          p-6 outline-none
          ${o?"bg-gray-900 text-gray-200":"bg-gray-100 text-gray-800"}
        `,children:e.jsxs("div",{className:"max-w-3xl mx-auto",children:[e.jsxs("div",{className:"flex items-center mb-6",children:[e.jsx("button",{onClick:()=>g&&g("settings"),className:`
                p-2 rounded-full mr-2
                ${o?"hover:bg-gray-800":"hover:bg-gray-200"}
                transition-colors duration-200
              `,children:e.jsx(k,{size:20})}),e.jsx("h1",{className:"text-2xl font-bold",children:"Keyboard Shortcuts"})]}),e.jsx(f,{icon:e.jsx(C,{size:20}),children:"Customize keyboard shortcuts to make your workflow faster and more efficient. Click any shortcut to change it, then press the new key combination."}),x&&e.jsx(f,{icon:e.jsx(P,{size:20}),variant:"success",children:x}),Object.entries(N).map(([t,a])=>w(t,a.title,a.icon)),e.jsxs("div",{className:"flex gap-4 mt-8 mb-12",children:[e.jsxs("button",{onClick:v,className:`
                px-6 py-2 rounded-lg font-medium flex items-center gap-2
                ${o?"bg-blue-600 hover:bg-blue-700":"bg-blue-500 hover:bg-blue-600"}
                text-white transition-all duration-300 ease-in-out
                transform hover:scale-105
              `,children:[e.jsx(z,{size:18,className:"transform group-hover:rotate-12 transition-transform duration-300"}),"Save Changes"]}),e.jsxs("button",{onClick:j,className:`
                px-6 py-2 rounded-lg font-medium flex items-center gap-2
                ${o?"bg-gray-800 hover:bg-gray-700 text-gray-300":"bg-white hover:bg-gray-50 text-gray-700"}
                transition-all duration-300 ease-in-out
                transform hover:scale-105
                border ${o?"border-gray-700":"border-gray-300"}
              `,children:[e.jsx(M,{size:18,className:"transform hover:rotate-180 transition-transform duration-500"}),"Reset to Defaults"]})]})]})})})};export{_ as default};
