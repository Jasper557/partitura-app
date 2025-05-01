import{j as e,a as ve,Z as we,b as je,X as ce,F as Ce,c as Ke,d as Oe,e as We,D as He,f as Ve,g as _e,H as qe,h as Qe,P as Xe,T as Ge,i as Ye,k as Je,U as et,l as tt,m as st,M as rt}from"./ui-DgCwhHkT.js";import{c as V,r as t,R as at}from"./react-C14kkwO6.js";import{u as Se,a as ue,b as nt,c as Ee}from"./index-CFOCruvU.js";import{D as ot,P as lt,p as Te}from"./pdf-BMsdgI1N.js";import{g as it,s as ct,u as ut,d as dt}from"./sheetMusicService-C-r0DAeS.js";import{u as ft}from"./useScrollReset-ZRr5ZJk0.js";import{P as mt}from"./PageTransition-BFnjTUrs.js";import{w as gt}from"./withApiAvailability-ByMhxnoO.js";import"./supabase-D5PNQMqt.js";var Fe={exports:{}};(function(r,n){(function(d,i){i()})(V,function(){function d(o,a){return typeof a>"u"?a={autoBom:!1}:typeof a!="object"&&(console.warn("Deprecated: Expected third argument to be a object"),a={autoBom:!a}),a.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(o.type)?new Blob(["\uFEFF",o],{type:o.type}):o}function i(o,a,x){var u=new XMLHttpRequest;u.open("GET",o),u.responseType="blob",u.onload=function(){h(u.response,a,x)},u.onerror=function(){console.error("could not download file")},u.send()}function s(o){var a=new XMLHttpRequest;a.open("HEAD",o,!1);try{a.send()}catch{}return 200<=a.status&&299>=a.status}function f(o){try{o.dispatchEvent(new MouseEvent("click"))}catch{var a=document.createEvent("MouseEvents");a.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),o.dispatchEvent(a)}}var m=typeof window=="object"&&window.window===window?window:typeof self=="object"&&self.self===self?self:typeof V=="object"&&V.global===V?V:void 0,p=m.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),h=m.saveAs||(typeof window!="object"||window!==m?function(){}:"download"in HTMLAnchorElement.prototype&&!p?function(o,a,x){var u=m.URL||m.webkitURL,y=document.createElement("a");a=a||o.name||"download",y.download=a,y.rel="noopener",typeof o=="string"?(y.href=o,y.origin===location.origin?f(y):s(y.href)?i(o,a,x):f(y,y.target="_blank")):(y.href=u.createObjectURL(o),setTimeout(function(){u.revokeObjectURL(y.href)},4e4),setTimeout(function(){f(y)},0))}:"msSaveOrOpenBlob"in navigator?function(o,a,x){if(a=a||o.name||"download",typeof o!="string")navigator.msSaveOrOpenBlob(d(o,x),a);else if(s(o))i(o,a,x);else{var u=document.createElement("a");u.href=o,u.target="_blank",setTimeout(function(){f(u)})}}:function(o,a,x,u){if(u=u||open("","_blank"),u&&(u.document.title=u.document.body.innerText="downloading..."),typeof o=="string")return i(o,a,x);var y=o.type==="application/octet-stream",C=/constructor/i.test(m.HTMLElement)||m.safari,$=/CriOS\/[\d]+/.test(navigator.userAgent);if(($||y&&C||p)&&typeof FileReader<"u"){var S=new FileReader;S.onloadend=function(){var T=S.result;T=$?T:T.replace(/^data:[^;]*;/,"data:attachment/file;"),u?u.location.href=T:location=T,u=null},S.readAsDataURL(o)}else{var g=m.URL||m.webkitURL,N=g.createObjectURL(o);u?u.location=N:location.href=N,u=null,setTimeout(function(){g.revokeObjectURL(N)},4e4)}});m.saveAs=h.saveAs=h,r.exports=h})})(Fe);var Ne=Fe.exports;const xt=({pdfPath:r,isOpen:n,onClose:d,title:i,isDarkMode:s})=>{const[f,m]=t.useState(null),[p,h]=t.useState(1),[o,a]=t.useState(1),[x,u]=t.useState(null),[y,C]=t.useState(!1),[$,S]=t.useState(!0),[g,N]=t.useState(!0),[T,I]=t.useState(0),[R,k]=t.useState(null),[E,L]=t.useState(!1),[b,v]=t.useState(0),[w,j]=t.useState(0),[z,de]=t.useState(0),[fe,G]=t.useState(!1),[ze,Y]=t.useState(!1),[Pe,J]=t.useState(0),[Ie,ee]=t.useState(.95),[K,te]=t.useState(null),[_,A]=t.useState(!1),se=t.useRef(null),Re=t.useRef(null),re=t.useRef(null),me=t.useRef(null),O=t.useRef(null),D=t.useRef(null),{isShortcutTriggered:Z}=Se(),M=t.useCallback(()=>{me.current&&clearTimeout(me.current),O.current&&clearTimeout(O.current),D.current&&clearTimeout(D.current)},[]),q=t.useCallback(()=>{Y(!1),J(0),ee(.95),te(null),A(!1)},[]),B=t.useCallback(()=>{Y(!0),requestAnimationFrame(()=>{J(1),ee(1)})},[]),P=t.useCallback(()=>{J(0),ee(.9),setTimeout(()=>{Y(!1)},150)},[]),U=t.useCallback(c=>{te(c),B(),O.current&&clearTimeout(O.current),O.current=setTimeout(()=>{te(null),P()},600)},[B,P]);t.useCallback(()=>{A(!0),B(),D.current&&clearTimeout(D.current),D.current=setTimeout(()=>{A(!1),P()},300)},[B,P]),t.useEffect(()=>{if(n){const c=setTimeout(()=>G(!0),50);return()=>clearTimeout(c)}else G(!1)},[n]),t.useEffect(()=>{n||q()},[n,q]),t.useEffect(()=>()=>{document.body.style.overflow="",M()},[M]),t.useEffect(()=>{if(n&&r){q(),M(),a(1),N(!0),I(0),k(null),h(1);const c=setInterval(()=>{I(l=>{const F=l+Math.random()*15;return F>90?90:F})},500);try{if(r instanceof File){const l=URL.createObjectURL(r);return u(l),()=>{clearInterval(c),URL.revokeObjectURL(l),u(null)}}else return u(r),()=>{clearInterval(c),u(null)}}catch{clearInterval(c),k("Failed to load PDF file"),N(!1)}}},[n,r,M,q]);const ke=t.useCallback(({numPages:c})=>{m(c),I(100),setTimeout(()=>{N(!1)},300),k(null)},[]),Le=t.useCallback(c=>{console.error("PDF loading error:",c),k("Failed to load PDF file"),N(!1)},[]),Ae=t.useCallback(c=>{if(re.current){const{width:l,height:F}=re.current.getBoundingClientRect();v(l),j(F)}E&&setTimeout(()=>{L(!1)},100)},[E]),ae=t.useCallback(()=>{f&&p<f&&!E&&(L(!0),de(c=>c+1),h(p+1))},[f,p,E]),ne=t.useCallback(()=>{p>1&&!E&&(L(!0),de(c=>c+1),h(p-1))},[p,E]),W=t.useCallback(c=>{C(c),document.body.style.overflow=c?"hidden":"";const l=()=>{!document.fullscreenElement&&y&&(C(!1),document.body.style.overflow="")};return document.addEventListener("fullscreenchange",l),()=>{document.removeEventListener("fullscreenchange",l)}},[y]),oe=t.useCallback(async()=>{var c;if(y)try{document.exitFullscreen&&await document.exitFullscreen(),W(!1)}catch(l){console.error("Error exiting fullscreen:",l)}else try{(c=se.current)!=null&&c.requestFullscreen&&await se.current.requestFullscreen(),W(!0)}catch(l){console.error("Error enabling fullscreen:",l)}},[y,W]),Q=t.useCallback(()=>{if(o>=3){U("max");return}a(c=>Math.min(c+.1,3))},[o,U]),X=t.useCallback(()=>{if(o<=.5){U("min");return}a(c=>Math.max(c-.1,.5))},[o,U]),ge=t.useCallback(c=>{if(!$)return;if(c.ctrlKey||c.metaKey){if(c.preventDefault(),c.stopPropagation(),A(!0),B(),c.deltaY<0){if(o>=3){U("max");return}a(F=>{const H=F+.05;return H>3?3:H})}else{if(o<=.5){U("min");return}a(F=>{const H=F-.05;return H<.5?.5:H})}D.current=setTimeout(()=>{A(!1),P()},100)}},[$,o,B,U,P]);t.useEffect(()=>{const c=l=>{(l.key==="Control"||l.key==="Meta")&&_&&(A(!1),P())};return n&&window.addEventListener("keyup",c),()=>window.removeEventListener("keyup",c)},[n,_,P]),t.useEffect(()=>{if(!n)return;let c=null;const l=F=>{$&&(F.ctrlKey||F.metaKey)&&(ge(F),c&&clearTimeout(c),c=setTimeout(()=>{_&&(A(!1),P())},100))};return window.addEventListener("wheel",l,{passive:!1,capture:!0}),()=>{window.removeEventListener("wheel",l,{capture:!0}),c&&clearTimeout(c),M()}},[n,ge,$,_,P,M]),t.useEffect(()=>{const c=l=>{l.ctrlKey&&(l.key==="+"||l.key==="-"||l.key==="="||l.code==="Equal"||l.code==="Minus")&&l.preventDefault(),Z(l,"pdfViewer","previousPage")?(l.preventDefault(),ne()):Z(l,"pdfViewer","nextPage")?(l.preventDefault(),ae()):Z(l,"pdfViewer","zoomIn")?(l.preventDefault(),Q()):Z(l,"pdfViewer","zoomOut")?(l.preventDefault(),X()):Z(l,"pdfViewer","toggleFullscreen")&&(l.preventDefault(),oe()),l.ctrlKey&&(l.key==="+"||l.key==="="||l.code==="Equal"?(l.preventDefault(),Q()):(l.key==="-"||l.code==="Minus")&&(l.preventDefault(),X()))};return window.addEventListener("keydown",c),()=>window.removeEventListener("keydown",c)},[Z,ne,ae,Q,X,oe]);const le=t.useCallback(c=>{c.stopPropagation(),G(!1),setTimeout(()=>{if(d(),y)try{document.exitFullscreen&&document.exitFullscreen(),W(!1)}catch(l){console.error("Error exiting fullscreen:",l)}},300)},[d,y,W]),Ue=t.useCallback(async()=>{try{if(typeof r=="string"){const l=await(await fetch(r)).blob();Ne.saveAs(l,`${i||"document"}.pdf`)}else r instanceof File&&Ne.saveAs(r,r.name)}catch(c){console.error("Error downloading PDF:",c)}},[r,i]);if(!n)return null;const ie=s?"text-gray-200":"text-gray-800",xe=s?"bg-gray-800":"bg-white",he=s?"border-gray-700":"border-gray-200",pe=s?"bg-gray-900":"bg-gray-50",De=s?"bg-gray-700":"bg-gray-200",Ze=s?"bg-blue-500":"bg-blue-600",Me=s?"bg-red-900/20":"bg-red-50",ye=s?"text-red-300":"text-red-600",be=s?"bg-gray-700":"bg-gray-300",Be=()=>ze?e.jsx("div",{className:`
          absolute top-4 left-1/2 z-50
          ${K?"bg-amber-500/90":"bg-blue-500/90"} 
          text-white px-4 py-2 rounded-full
          flex items-center gap-2 shadow-lg
          will-change-transform will-change-opacity
        `,style:{opacity:Pe,transform:`translate(-50%, 0) scale(${Ie})`,transition:"opacity 150ms cubic-bezier(0.4, 0.0, 0.2, 1), transform 150ms cubic-bezier(0.18, 0.89, 0.32, 1.28)"},children:K?e.jsxs(e.Fragment,{children:[e.jsx(je,{size:16,className:`${K==="max"?"":"hidden"} animate-pulse`}),e.jsx(we,{size:16,className:`${K==="min"?"":"hidden"} animate-pulse`}),e.jsx("span",{className:"font-medium text-sm",children:K==="max"?"Maximum zoom reached":"Minimum zoom reached"})]}):e.jsxs(e.Fragment,{children:[e.jsx(ve,{size:16,className:"animate-pulse"}),e.jsxs("span",{className:"font-medium text-sm",children:["Zoom: ",Math.round(o*100),"%"]})]})}):null;return e.jsx("div",{className:`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black transition-opacity duration-300 ease-in-out
        ${fe?"bg-opacity-75":"bg-opacity-0"} 
      `,onClick:le,children:e.jsxs("div",{ref:se,className:`
          relative w-full max-w-4xl h-[90vh] 
          ${xe} 
          rounded-lg shadow-xl overflow-hidden 
          ${y?"max-w-none m-0 rounded-none h-screen":""}
          transition-all duration-300 ease-out
          ${fe?"opacity-100 scale-100":"opacity-0 scale-95"}
        `,onClick:c=>c.stopPropagation(),children:[e.jsxs("div",{className:`flex items-center justify-between p-4 border-b ${he} ${pe}`,children:[e.jsx("h3",{className:`font-semibold truncate ${ie}`,children:i}),e.jsxs("div",{className:"flex items-center gap-2",children:[$&&e.jsxs("div",{className:`
                flex items-center gap-1 px-2 py-1 rounded-full text-xs
                ${s?"bg-blue-600/20 text-blue-300":"bg-blue-100 text-blue-700"}
              `,children:[e.jsx(ve,{size:12}),e.jsx("span",{children:"Ctrl+Wheel Zoom"})]}),e.jsx("button",{onClick:X,disabled:g,className:`
                p-2 rounded-full transition-colors duration-200
                ${s?"hover:bg-gray-700 text-gray-300":"hover:bg-gray-200 text-gray-600"} 
                disabled:opacity-50 disabled:cursor-not-allowed
              `,"aria-label":"Zoom out",children:e.jsx(we,{size:20})}),e.jsxs("span",{className:`${s?"text-gray-300":"text-gray-600"}`,children:[Math.round(o*100),"%"]}),e.jsx("button",{onClick:Q,disabled:g,className:`
                p-2 rounded-full transition-colors duration-200
                ${s?"hover:bg-gray-700 text-gray-300":"hover:bg-gray-200 text-gray-600"} 
                disabled:opacity-50 disabled:cursor-not-allowed
              `,"aria-label":"Zoom in",children:e.jsx(je,{size:20})}),e.jsx("button",{onClick:le,className:`p-2 rounded-full ${s?"hover:bg-gray-700 text-gray-300":"hover:bg-gray-200 text-gray-600"}`,children:e.jsx(ce,{size:20})})]})]}),e.jsxs("div",{ref:Re,className:`
            overflow-auto flex flex-col items-center p-4 
            ${xe} 
            pdf-viewer-content
            ${y?"h-[calc(100vh-8.5rem)]":"h-[calc(90vh-8.5rem)]"}
            relative
          `,children:[e.jsx(Be,{}),g&&e.jsx("div",{className:"absolute inset-0 flex flex-col items-center justify-center p-8 z-20",children:e.jsxs("div",{className:"w-full max-w-md flex flex-col items-center gap-4",children:[e.jsx("div",{className:"flex items-center justify-center",children:e.jsx(Ce,{size:32,className:`${ie} mb-2 opacity-90`})}),e.jsx("div",{className:"font-medium text-lg mb-2 text-center max-w-[80%]",children:e.jsxs("span",{className:ie,children:["Loading ",i]})}),e.jsx("div",{className:`w-full h-2 rounded-full overflow-hidden ${De}`,children:e.jsx("div",{className:`h-full ${Ze} transition-all duration-300 ease-out`,style:{width:`${T}%`}})}),e.jsx("div",{className:`text-sm ${s?"text-gray-400":"text-gray-500"}`,children:"Preparing document..."})]})}),R&&e.jsx("div",{className:"absolute inset-0 flex flex-col items-center justify-center p-8",children:e.jsxs("div",{className:`p-6 rounded-lg ${Me} max-w-md shadow-lg`,children:[e.jsxs("div",{className:"flex items-center gap-4 mb-4",children:[e.jsx(Ke,{size:24,className:ye}),e.jsx("span",{className:`font-medium ${ye}`,children:"Failed to load document"})]}),e.jsx("p",{className:`${s?"text-gray-300":"text-gray-600"} text-sm`,children:"There was a problem loading this PDF. Please check if the file is valid or try again later."}),e.jsx("button",{onClick:le,className:`mt-4 px-4 py-2 rounded-md ${s?"bg-gray-700 hover:bg-gray-600 text-white":"bg-gray-200 hover:bg-gray-300 text-gray-800"} transition-colors`,children:"Close"})]})}),E&&!g&&b>0&&e.jsx("div",{className:`
                absolute z-10 rounded-lg shadow-lg ${be}
                transition-opacity duration-200 opacity-80
              `,style:{width:`${b}px`,height:`${w}px`}}),x&&!R&&e.jsx(ot,{file:x,onLoadSuccess:ke,onLoadError:Le,loading:null,error:null,className:"max-w-full relative z-10",children:(!g||E)&&!R&&e.jsx("div",{ref:re,className:"relative",children:e.jsx(lt,{pageNumber:p,scale:o,className:`
                      shadow-lg bg-white rounded-lg
                      transition-transform duration-100 ease-out
                      ${E?"opacity-0":"opacity-100"}
                    `,renderAnnotationLayer:!1,renderTextLayer:!1,onRenderSuccess:Ae,loading:""},`page_${p}`)},z)}),g&&e.jsx("div",{className:`w-full max-w-[600px] aspect-[3/4] ${be} rounded-lg opacity-30 absolute z-0`})]}),!R&&f&&e.jsxs("div",{className:`absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 ${pe} border-t ${he}`,children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("button",{onClick:ne,disabled:p<=1||g||E,className:`
                  p-2 rounded-full 
                  ${s?"hover:bg-gray-700 text-gray-300":"hover:bg-gray-200 text-gray-600"} 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200
                `,children:e.jsx(Oe,{size:20})}),e.jsxs("span",{className:`${s?"text-gray-300":"text-gray-600"}`,children:["Page ",p," of ",f]}),e.jsx("button",{onClick:ae,disabled:p>=f||g||E,className:`
                  p-2 rounded-full 
                  ${s?"hover:bg-gray-700 text-gray-300":"hover:bg-gray-200 text-gray-600"} 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200
                `,children:e.jsx(We,{size:20})})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:Ue,disabled:g,className:`
                  p-2 rounded-full 
                  ${s?"hover:bg-gray-700 text-gray-300":"hover:bg-gray-200 text-gray-600"}
                  transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `,children:e.jsx(He,{size:20})}),e.jsx("button",{onClick:oe,disabled:g,className:`
                  p-2 rounded-full 
                  ${s?"hover:bg-gray-700 text-gray-300":"hover:bg-gray-200 text-gray-600"} 
                  transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `,children:y?e.jsx(Ve,{size:20}):e.jsx(_e,{size:20})})]})]})]})})};Te.GlobalWorkerOptions.workerSrc=new URL("/partitura/assets/pdf.worker.min-DKQKFyKK.js",import.meta.url).toString();const ht=({x:r,y:n,isFavoriting:d,index:i})=>{const s=Math.PI*2*i/6,f=20+i%3*10,m=Math.cos(s)*f,p=Math.sin(s)*f,h={"--tx":`${m}px`,"--ty":`${p}px`,left:"calc(50% - 7px)",top:"calc(50% - 7px)",position:"absolute",fontSize:"14px",pointerEvents:"none",transform:"translate3d(0, 0, 0)",willChange:"transform, opacity",zIndex:60};return e.jsx("div",{className:"particle",style:h,children:d?"❤️":"💔"})},pt=r=>{const[n,d]=t.useState(null),[i,s]=t.useState(!1);return t.useEffect(()=>((async()=>{if(r){s(!0);try{const m=r instanceof File?URL.createObjectURL(r):r,o=await(await Te.getDocument(m).promise).getPage(1),a=o.getViewport({scale:2}),x=document.createElement("canvas"),u=x.getContext("2d");if(!u)throw new Error("Could not get canvas context");x.width=a.width,x.height=a.height,await o.render({canvasContext:u,viewport:a}).promise;const y=x.toDataURL("image/jpeg",.95);d(y),x.remove(),r instanceof File&&URL.revokeObjectURL(m)}catch(m){console.error("Error generating thumbnail:",m)}finally{s(!1)}}})(),()=>{n&&d(null)}),[r]),{thumbnail:n,isLoading:i}},yt=({isLoading:r,thumbnail:n,title:d,isDarkMode:i})=>r?e.jsxs("div",{className:`absolute inset-0 flex flex-col items-center justify-center p-4 ${i?"text-gray-400":"text-gray-500"}`,children:[e.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-current mb-2"}),e.jsx("span",{className:"text-sm",children:"Loading preview..."})]}):n?e.jsx("img",{src:n,alt:`Preview of ${d}`,className:"absolute inset-0 w-full h-full object-contain bg-white"}):e.jsxs("div",{className:`absolute inset-0 flex flex-col items-center justify-center p-4 ${i?"text-gray-400":"text-gray-500"}`,children:[e.jsx(Ce,{size:32,className:"mb-2"}),e.jsx("span",{className:"text-sm",children:"No preview available"})]}),$e=({value:r,onChange:n,isTitle:d,isDarkMode:i,isEditing:s,onFinishEditing:f})=>{const[m,p]=t.useState(r),h=at.useRef(null);t.useEffect(()=>{if(s&&d&&h.current){h.current.focus();const x=document.createRange();x.selectNodeContents(h.current);const u=window.getSelection();u&&(u.removeAllRanges(),u.addRange(x))}},[s,d]),t.useEffect(()=>{p(r)},[r]);const o=()=>{h.current&&n(h.current.textContent||r)},a=x=>{x.key==="Enter"&&(x.preventDefault(),h.current&&n(h.current.textContent||r),f()),x.key==="Escape"&&(h.current&&(h.current.textContent=r),f())};return e.jsx("div",{ref:h,contentEditable:s,onBlur:o,onKeyDown:a,suppressContentEditableWarning:!0,className:`
        truncate outline-none
        ${s?"border-b "+(i?"border-gray-600":"border-gray-300"):""}
        ${d?`font-bold ${i?"text-gray-100":"text-gray-900"}`:`text-sm ${i?"text-gray-400":"text-gray-600"}`}
        ${s?"":"select-none"}
      `,children:r})},bt=()=>{const r=()=>{const n=(Math.random()-.5)*100,d=(Math.random()-.5)*100,i=(Math.random()-.5)*90,s=Math.random()*50,f=50+Math.random()*50,m=Math.random()*50,p=50+Math.random()*50;return{"--tx":`${n}px`,"--ty":`${d}px`,"--rotate":`${i}deg`,"--clip-1":`${s}%`,"--clip-2":`${f}%`,"--clip-3":`${m}%`,"--clip-4":`${p}%`}};return e.jsx("div",{className:"delete-piece",style:r()})},vt=({item:r,onUpdate:n,onDelete:d,isNew:i=!1})=>{const{isDarkMode:s}=ue(),[f,m]=t.useState(!1),[p,h]=t.useState(r.title),[o,a]=t.useState(r.composer),[x,u]=t.useState(!1),[y,C]=t.useState(!0),[$,S]=t.useState(!1),[g,N]=t.useState(!1),[T,I]=t.useState([]),R=t.useRef(null),{thumbnail:k,isLoading:E}=pt(r.pdfPath),[L,b]=t.useState(!1);t.useEffect(()=>{setTimeout(()=>C(!1),50)},[]);const v=()=>{u(!0),I(Array.from({length:6},(j,z)=>z)),setTimeout(()=>d(r.id),500)},w=j=>{j.stopPropagation(),!$&&(N(!r.isFavorite),S(!0),setTimeout(()=>{S(!1)},600),requestAnimationFrame(()=>{n(r.id,{isFavorite:!r.isFavorite})}))};return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:`
          rounded-xl shadow-lg overflow-hidden
          ${s?"bg-gray-800":"bg-white"}
          transition-all duration-500
          hover:shadow-xl
          group
          ${x?"scale-95 opacity-0":"scale-100 opacity-100"}
          ${y?"scale-95 opacity-0":"scale-100 opacity-100"}
          ${i?"ring-2 ring-blue-500 animate-pulse-twice":""}
          flex flex-col
          w-full
          ${f?"editing-active":""}
          relative
        `,children:[i&&e.jsx("div",{className:"absolute top-3 left-3 z-50 bg-blue-500 text-white text-xs py-1 px-2 rounded-full animate-bounce",children:"New"}),x&&T.map((j,z)=>e.jsx(bt,{},z)),e.jsxs("div",{className:"relative aspect-[3/4] rounded-t-xl overflow-hidden",children:[e.jsx("div",{onClick:()=>b(!0),className:`
              absolute inset-0
              cursor-pointer
              transition-transform duration-200
              hover:scale-[1.02]
              ${s?"bg-gray-700":"bg-gray-100"}
            `,children:e.jsx(yt,{isLoading:E,thumbnail:k,title:r.title,isDarkMode:s})}),e.jsx("div",{className:"absolute top-2 right-2 z-50",children:e.jsxs("button",{ref:R,onClick:w,className:`
                heart-button
                p-2 rounded-full
                ${s?"bg-gray-800/80":"bg-white/80"}
                shadow-md backdrop-blur-sm
                transition-colors duration-200
                ${r.isFavorite?"text-red-500 active":"text-gray-400 hover:text-red-500"}
                relative
              `,children:[e.jsx(qe,{fill:r.isFavorite?"currentColor":"none",size:20}),$&&Array.from({length:4},(j,z)=>e.jsx(ht,{x:0,y:0,isFavoriting:g,index:z},z))]})})]}),e.jsx("div",{className:`
          p-4 
          ${s?"bg-gray-800":"bg-white"}
          rounded-b-xl
        `,children:e.jsxs("div",{className:"flex justify-between items-start gap-4",children:[e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsx($e,{value:p,onChange:j=>{h(j),n(r.id,{title:j})},isTitle:!0,isDarkMode:s,isEditing:f,onFinishEditing:()=>m(!1)}),e.jsx($e,{value:o,onChange:j=>{a(j),n(r.id,{composer:j})},isDarkMode:s,isEditing:f,onFinishEditing:()=>m(!1)})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:()=>m(!f),className:`
                  p-2 rounded-full
                  ${s?"hover:bg-gray-700 text-gray-400":"hover:bg-gray-100 text-gray-500"}
                  ${f?"bg-blue-500/10 text-blue-500":""}
                  transition-colors duration-200
                `,title:f?"Save changes":"Edit",children:f?e.jsx(Qe,{size:16}):e.jsx(Xe,{size:16})}),e.jsx("button",{onClick:v,className:`
                  p-2 rounded-full
                  ${s?"hover:bg-gray-700 text-gray-400 hover:text-red-400":"hover:bg-gray-100 text-gray-500 hover:text-red-500"}
                  transition-colors duration-200
                `,title:"Delete",children:e.jsx(Ge,{size:16})})]})]})})]}),e.jsx(xt,{pdfPath:r.pdfPath,isOpen:L,onClose:()=>b(!1),title:r.title,isDarkMode:s})]})},wt=({onFileSelect:r,selectedFile:n,disabled:d=!1})=>{const{isDarkMode:i}=ue(),[s,f]=t.useState(!1),[m,p]=t.useState(!1);t.useEffect(()=>{if(n){p(!0);const g=setTimeout(()=>{p(!1)},800);return()=>clearTimeout(g)}},[n]);const h=t.useCallback(g=>{d||(g.preventDefault(),g.stopPropagation(),g.type==="dragenter"||g.type==="dragover"?f(!0):g.type==="dragleave"&&f(!1))},[d]),o=t.useCallback(g=>{if(d)return;g.preventDefault(),g.stopPropagation(),f(!1);const T=Array.from(g.dataTransfer.files).find(I=>I.type==="application/pdf");T&&r(T)},[r,d]),a=g=>{if(d)return;const N=g.target.files;N&&N[0]&&r(N[0])},x=i?"bg-gray-800":"bg-gray-50",u=i?"border-gray-700":"border-gray-200",y=i?"text-gray-300":"text-gray-600",C=i?"text-gray-400":"text-gray-500",$=n?"border-green-500":s?"border-blue-500":u,S=n?i?"bg-gray-800":"bg-white":s?i?"bg-blue-900/10":"bg-blue-50/50":x;return e.jsxs("div",{onDragEnter:h,onDragLeave:h,onDragOver:h,onDrop:o,className:`
        relative
        border border-dashed rounded-lg
        transition-all duration-200
        ${d?"cursor-not-allowed opacity-60":"cursor-pointer"}
        flex flex-col items-center justify-center
        h-28
        overflow-hidden
        ${$}
        ${S}
        ${s?"scale-[1.01]":""}
      `,children:[e.jsx("input",{type:"file",accept:".pdf",onChange:a,disabled:d,className:`absolute inset-0 w-full h-full opacity-0 ${d?"cursor-not-allowed":"cursor-pointer"} z-10`}),m&&e.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-green-500/5 z-20 animate-fadeIn",children:e.jsx(Ye,{size:30,className:"text-green-500 animate-pulse"})}),n?e.jsxs("div",{className:"flex items-center gap-3 px-4 py-2",children:[e.jsx(Je,{size:20,className:"text-green-500"}),e.jsx("span",{className:`font-medium text-sm truncate max-w-[200px] ${y}`,children:n.name})]}):e.jsxs("div",{className:`
          flex flex-col items-center justify-center gap-1 p-4
          transition-transform duration-300
          ${s?"scale-110":""}
        `,children:[e.jsx(et,{size:20,className:`
              ${s?"text-blue-500":C}
              ${d?"opacity-50":""}
            `}),e.jsx("span",{className:`text-xs ${y} ${d?"opacity-50":""}`,children:s?"Drop PDF here":d?"Upload Disabled":"Upload PDF"})]})]})},jt=({onClick:r,isDarkMode:n})=>e.jsx("div",{onClick:r,className:`
      rounded-xl shadow-lg overflow-hidden cursor-pointer
      transition-all duration-200
      hover:shadow-xl hover:scale-[1.02]
      ${n?"bg-gray-800/50":"bg-white/50"}
      border-2 border-dashed
      ${n?"border-gray-700":"border-gray-200"}
      group
      h-[420px]
    `,children:e.jsxs("div",{className:"h-full flex flex-col items-center justify-center p-4",children:[e.jsx("div",{className:`
        rounded-full p-4 mb-4
        ${n?"bg-gray-700/50":"bg-gray-100/50"}
        group-hover:scale-110 transition-transform duration-200
      `,children:e.jsx(tt,{size:32,className:n?"text-gray-400":"text-gray-500"})}),e.jsx("p",{className:`text-center ${n?"text-gray-400":"text-gray-500"}`,children:"Add New Sheet Music"})]})}),Nt=({onSearch:r,isDarkMode:n,inputRef:d,isExpanded:i,setIsExpanded:s})=>{const[f,m]=t.useState(""),p=t.useRef(null),h=a=>{m(a),r(a)},o=()=>{s(!0),setTimeout(()=>{var a;(a=d.current)==null||a.focus()},50)};return t.useEffect(()=>{const a=x=>{p.current&&!p.current.contains(x.target)&&(f||s(!1))};return document.addEventListener("mousedown",a),()=>{document.removeEventListener("mousedown",a)}},[f,s]),e.jsx("div",{className:"relative flex items-center",ref:p,children:e.jsxs("div",{className:`
          flex items-center
          rounded-full
          ${n?"bg-gray-800":"bg-white"}
          shadow-md
          transition-all duration-300 ease-in-out
          ${i?"w-64":"w-10"}
          h-10
        `,children:[e.jsx("button",{onClick:o,className:`
            p-2 rounded-full
            ${n?"text-gray-400 hover:text-gray-300":"text-gray-600 hover:text-gray-800"}
            transition-colors duration-200
            flex-shrink-0
          `,children:e.jsx(st,{size:20})}),e.jsx("input",{ref:d,type:"text",placeholder:"Search music...",value:f,onChange:a=>h(a.target.value),className:`
            bg-transparent
            border-none
            outline-none
            ${n?"text-gray-100 placeholder-gray-500":"text-gray-900 placeholder-gray-400"}
            transition-all duration-300
            ${i?"w-full opacity-100 px-2":"w-0 opacity-0 px-0"}
          `}),f&&e.jsx("button",{onClick:()=>h(""),className:`
              p-2
              ${n?"text-gray-400 hover:text-gray-300":"text-gray-600 hover:text-gray-800"}
              transition-colors duration-200
            `,children:e.jsx(ce,{size:16})})]})})},$t=({isOpen:r,onClose:n,onAdd:d,data:i,onDataChange:s,isDarkMode:f,isLoading:m})=>{const{showToast:p}=Ee(),[h,o]=t.useState(!1),a=()=>{if(m){p("Upload in progress. Please wait...","warning");return}n()};if(t.useEffect(()=>{if(r){const g=setTimeout(()=>o(!0),50);return()=>clearTimeout(g)}else o(!1)},[r]),!r)return null;const x=f?"bg-gray-900":"bg-white",u=f?"text-gray-100":"text-gray-900",y=f?"text-gray-400":"text-gray-500",C=f?"border-gray-700":"border-gray-200",$=f?"bg-gray-800":"bg-gray-50",S=i.title&&i.composer&&i.file;return e.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:[e.jsx("div",{className:`fixed inset-0 bg-black transition-opacity duration-300 ${h?"opacity-50":"opacity-0"}`,onClick:a}),e.jsxs("div",{className:`
          ${x} w-full max-w-lg rounded-xl overflow-hidden shadow-xl
          transition-all duration-500 ease-out
          ${h?"opacity-100 scale-100":"opacity-0 scale-95"}
          z-10 relative
        `,children:[e.jsx("button",{onClick:a,className:`absolute top-4 right-4 p-2 rounded-full transition-colors ${y} hover:${u}`,disabled:m,children:e.jsx(ce,{size:18})}),e.jsx("div",{className:"p-6 pb-0",children:e.jsxs("h2",{className:`text-xl font-medium ${u} flex items-center gap-2`,children:[e.jsx(rt,{size:18,className:"text-blue-500"}),e.jsx("span",{children:"New Sheet Music"})]})}),e.jsxs("div",{className:"p-6 space-y-4",children:[e.jsx("input",{type:"text",placeholder:"Title",value:i.title,onChange:g=>s({...i,title:g.target.value}),disabled:m,className:`
              w-full px-4 py-2 rounded-lg border ${C}
              ${$} ${u}
              focus:outline-none focus:ring-1 focus:ring-blue-500
              transition-all duration-200
              ${m?"opacity-70 cursor-not-allowed":""}
            `}),e.jsx("input",{type:"text",placeholder:"Composer",value:i.composer,onChange:g=>s({...i,composer:g.target.value}),disabled:m,className:`
              w-full px-4 py-2 rounded-lg border ${C}
              ${$} ${u}
              focus:outline-none focus:ring-1 focus:ring-blue-500
              transition-all duration-200
              ${m?"opacity-70 cursor-not-allowed":""}
            `}),e.jsx("div",{className:"pt-2",children:e.jsx(wt,{onFileSelect:g=>s({...i,file:g||void 0}),selectedFile:i.file,disabled:m})}),e.jsx("button",{onClick:()=>S&&!m&&d(i),disabled:!S||m,className:`
              w-full py-2 rounded-lg mt-4
              transition-all duration-300
              flex items-center justify-center gap-2
              ${S&&!m?"bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg":"bg-gray-300 cursor-not-allowed text-gray-500"}
              ${i.file&&!m?"animate-pulse-once":""}
            `,children:m?e.jsxs(e.Fragment,{children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-2 h-4 w-4 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Creating..."]}):"Create"})]})]})]})},Ct=()=>{const{isDarkMode:r}=ue(),{user:n}=nt(),{showToast:d}=Ee(),{isShortcutTriggered:i}=Se(),[s,f]=t.useState(!1),[m,p]=t.useState(!1),[h,o]=t.useState(""),[a,x]=t.useState(!1),u=t.useRef(null),[y,C]=t.useState([]),[$,S]=t.useState(null),[g,N]=t.useState({title:"",composer:""});ft(),t.useEffect(()=>{const b=v=>{i(v,"sheetMusic","search")&&(v.preventDefault(),x(!0),setTimeout(()=>{var w;(w=u.current)==null||w.focus()},50))};return window.addEventListener("keydown",b),()=>{window.removeEventListener("keydown",b)}},[i]),t.useEffect(()=>{(async()=>{if(n)try{const v=await it(n.id);C(v)}catch(v){console.error("Error loading sheet music:",v),d("Failed to load your sheet music","error")}})()},[n,d]);const T=async b=>{if(!(!n||!b.file))try{p(!0);const v=crypto.randomUUID(),w={id:v,title:b.title,composer:b.composer,dateAdded:new Date,isFavorite:!1,pdfPath:""};f(!1),d(`Uploading "${b.title}"...`,"info");const j=await ct(n.id,w,b.file);w.pdfPath=j,C(z=>[w,...z]),N({title:"",composer:""}),S(v),setTimeout(()=>S(null),3e3),d(`"${b.title}" successfully added!`,"success")}catch(v){console.error("Error adding new sheet music:",v),d("Failed to add sheet music. Please try again.","error")}finally{p(!1)}},I=async(b,v)=>{if(n)try{await ut(n.id,b,v),C(w=>w.map(j=>j.id===b?{...j,...v}:j))}catch(w){console.error("Error updating sheet music:",w),d("Failed to update sheet music","error")}},R=async b=>{if(n)try{await dt(n.id,b),C(v=>v.filter(w=>w.id!==b)),d("Sheet music deleted","info")}catch(v){console.error("Error deleting sheet music:",v),d("Failed to delete sheet music","error")}},k=t.useMemo(()=>{const b=h.toLowerCase();return y.filter(w=>w.title.toLowerCase().includes(b)||w.composer.toLowerCase().includes(b)).sort((w,j)=>w.isFavorite!==j.isFavorite?w.isFavorite?-1:1:j.dateAdded.getTime()-w.dateAdded.getTime())},[y,h]),E=()=>{if(m){d("Please wait for the current upload to finish","info");return}f(!0)},L=()=>{if(m){d("Upload in progress. Please wait...","warning");return}f(!1),N({title:"",composer:""})};return e.jsx(mt,{children:e.jsx("div",{className:`
        p-6 min-h-screen overflow-y-auto
        ${r?"bg-gray-900":"bg-gray-100"}
      `,children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs("div",{className:"flex justify-between items-center mb-6 sticky top-0 z-10 bg-inherit py-2",children:[e.jsx("h1",{className:`text-3xl font-bold ${r?"text-gray-100":"text-gray-900"}`,children:"Sheet Music"}),e.jsx(Nt,{onSearch:o,isDarkMode:r,inputRef:u,isExpanded:a,setIsExpanded:x})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6",children:[e.jsx(jt,{onClick:E,isDarkMode:r}),k.map(b=>e.jsx(vt,{item:b,onUpdate:I,onDelete:R,isNew:b.id===$},b.id))]}),e.jsx($t,{isOpen:s,onClose:L,onAdd:T,data:g,onDataChange:N,isDarkMode:r,isLoading:m})]})})})},Lt=gt(Ct,{message:"Sheet Music Library Unavailable"});export{Lt as default};
