import{j as e,V as f,a2 as m,w as v,a3 as N,O as w,F as S,a4 as C}from"./ui-DgCwhHkT.js";import{r as n}from"./react-C14kkwO6.js";import{a as $,b as k}from"./index-CFOCruvU.js";import{u as F}from"./useScrollReset-ZRr5ZJk0.js";import{I as g}from"./InfoBox-DNiEcY11.js";import{P as q}from"./PageTransition-BFnjTUrs.js";import"./supabase-D5PNQMqt.js";const A=({onNavigate:t})=>{var d;const{isDarkMode:s}=$(),{user:r}=k(),[a,x]=n.useState({name:((d=r==null?void 0:r.user_metadata)==null?void 0:d.full_name)||"",email:(r==null?void 0:r.email)||"",category:"general",message:""}),[c,u]=n.useState(!1),[b,h]=n.useState(!1);F();const l=i=>{const{name:o,value:y}=i.target;x(j=>({...j,[o]:y}))},p=async i=>{i.preventDefault(),u(!0),await new Promise(o=>setTimeout(o,1500)),console.log("Support request:",a),u(!1),h(!0)};return e.jsx(q,{children:e.jsx("div",{className:`p-6 ${s?"bg-gray-900 text-gray-200":"bg-gray-100 text-gray-800"}`,children:e.jsxs("div",{className:"max-w-3xl mx-auto",children:[e.jsxs("div",{className:"flex items-center mb-6",children:[e.jsx("button",{onClick:()=>t&&t("settings"),className:`
                p-2 rounded-full mr-2
                ${s?"hover:bg-gray-800":"hover:bg-gray-200"}
                transition-colors duration-200
              `,children:e.jsx(f,{size:20})}),e.jsx("h1",{className:"text-2xl font-bold",children:"Contact Support"})]}),e.jsx(g,{icon:e.jsx(m,{size:20}),children:"Need help with Partitura? Our support team is here to assist you. Fill out the form below and we'll get back to you as soon as possible."}),b?e.jsx(g,{icon:e.jsx(v,{size:20}),variant:"success",children:e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsx("h2",{className:"text-lg font-semibold mb-2",children:"Message Sent Successfully"}),e.jsx("p",{className:"text-center mb-4",children:"Thank you for contacting us. We've received your message and will respond to your inquiry within 24-48 hours."}),e.jsx("button",{onClick:()=>t&&t("settings"),className:`
                    px-6 py-2 rounded-lg font-medium
                    ${s?"bg-blue-600 hover:bg-blue-700":"bg-blue-500 hover:bg-blue-600"}
                    text-white transition-colors duration-200
                  `,children:"Return to Settings"})]})}):e.jsx("div",{className:`
              p-6 rounded-lg mb-8
              ${s?"bg-gray-800":"bg-white"}
              shadow-sm
            `,children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"name",className:`block mb-1 font-medium ${s?"text-gray-300":"text-gray-700"}`,children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(N,{size:16}),e.jsx("span",{children:"Your Name"})]})}),e.jsx("input",{type:"text",id:"name",name:"name",value:a.name,onChange:l,required:!0,className:`
                      w-full px-3 py-2 rounded-lg border
                      ${s?"bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500":"bg-white border-gray-300 text-gray-900 focus:border-blue-500"}
                      focus:outline-none focus:ring-1 focus:ring-blue-500
                    `,placeholder:"Enter your name"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"email",className:`block mb-1 font-medium ${s?"text-gray-300":"text-gray-700"}`,children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(w,{size:16}),e.jsx("span",{children:"Your Email"})]})}),e.jsx("input",{type:"email",id:"email",name:"email",value:a.email,onChange:l,required:!0,className:`
                      w-full px-3 py-2 rounded-lg border
                      ${s?"bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500":"bg-white border-gray-300 text-gray-900 focus:border-blue-500"}
                      focus:outline-none focus:ring-1 focus:ring-blue-500
                    `,placeholder:"Enter your email"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"category",className:`block mb-1 font-medium ${s?"text-gray-300":"text-gray-700"}`,children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(S,{size:16}),e.jsx("span",{children:"Issue Category"})]})}),e.jsxs("select",{id:"category",name:"category",value:a.category,onChange:l,required:!0,className:`
                      w-full px-3 py-2 rounded-lg border
                      ${s?"bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500":"bg-white border-gray-300 text-gray-900 focus:border-blue-500"}
                      focus:outline-none focus:ring-1 focus:ring-blue-500
                    `,children:[e.jsx("option",{value:"general",children:"General Inquiry"}),e.jsx("option",{value:"account",children:"Account Issues"}),e.jsx("option",{value:"sheet-music",children:"Sheet Music"}),e.jsx("option",{value:"practice",children:"Practice Features"}),e.jsx("option",{value:"bug",children:"Bug Report"}),e.jsx("option",{value:"feature",children:"Feature Request"})]})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"message",className:`block mb-1 font-medium ${s?"text-gray-300":"text-gray-700"}`,children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(m,{size:16}),e.jsx("span",{children:"Your Message"})]})}),e.jsx("textarea",{id:"message",name:"message",value:a.message,onChange:l,required:!0,rows:6,className:`
                      w-full px-3 py-2 rounded-lg border
                      ${s?"bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500":"bg-white border-gray-300 text-gray-900 focus:border-blue-500"}
                      focus:outline-none focus:ring-1 focus:ring-blue-500
                    `,placeholder:"Please describe your issue or question in detail..."})]}),e.jsx("div",{className:"flex justify-end mt-6",children:e.jsx("button",{type:"submit",onClick:p,disabled:c,className:`
                      flex items-center gap-2 px-6 py-2 rounded-lg font-medium
                      ${s?"bg-blue-600 hover:bg-blue-700":"bg-blue-500 hover:bg-blue-600"}
                      text-white transition-colors duration-200
                      disabled:opacity-70 disabled:cursor-not-allowed
                    `,children:c?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"}),e.jsx("span",{children:"Sending..."})]}):e.jsxs(e.Fragment,{children:[e.jsx(C,{size:18}),e.jsx("span",{children:"Send Message"})]})})})]})}),e.jsxs("div",{className:"mb-12",children:[e.jsx("h2",{className:`text-lg font-semibold mb-4 ${s?"text-gray-200":"text-gray-800"}`,children:"Other Ways to Contact Us"}),e.jsx("div",{className:`
              p-5 rounded-lg 
              ${s?"bg-gray-800":"bg-white"}
            `,children:e.jsxs("div",{className:`${s?"text-gray-300":"text-gray-600"}`,children:[e.jsx("p",{className:"mb-2",children:"For immediate assistance, you can:"}),e.jsxs("ul",{className:"list-disc pl-5 space-y-1",children:[e.jsxs("li",{children:["Email us directly at ",e.jsx("span",{className:"text-blue-400",children:"support@partitura.app"})]}),e.jsx("li",{children:"Chat with our support team during business hours (9am-5pm PST)"}),e.jsxs("li",{children:["Check our ",e.jsx("span",{className:"text-blue-400 cursor-pointer hover:underline",children:"Help Center"})," for frequently asked questions"]})]})]})})]})]})})})};export{A as default};
