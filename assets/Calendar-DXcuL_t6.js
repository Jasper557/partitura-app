import{j as e,q as se,r as ae,s as re,t as ne,M as q,d as ee,u as ye,e as de,C as le,X as ue,v as pe,h as be,w as fe,x as ve,T as je,y as Ne,z as we}from"./ui-DgCwhHkT.js";import{r as u}from"./react-C14kkwO6.js";import{a as _,b as $e,c as Ce}from"./index-CFOCruvU.js";import{f as Ee,u as Me,a as ke,d as Se,t as De}from"./calendarService-BJQaKnXb.js";import{i as Te,a as K,b as xe,s as te,e as me,c as Fe,d as Pe,f as ze,g as M,h as ge,j as he,k as Ie,l as B,m as X,n as Z,o as oe,p as Be,q as J}from"./data-2de0kleH.js";import{f as Oe}from"./sheetMusicService-C-r0DAeS.js";import{P as Re}from"./PageTransition-BFnjTUrs.js";import{w as Ae}from"./withApiAvailability-ByMhxnoO.js";import"./supabase-D5PNQMqt.js";const ie={practice:se,concert:ae,lesson:re,rehearsal:ne,recital:q},Le=({currentDate:s,events:i,onDateClick:p,onEventClick:$})=>{const{isDarkMode:b}=_(),j=()=>{const l=te(s),y=me(l),o=Fe(l),x=Pe(y),m=[];let g=[],v=o;for(;v<=x;){for(let C=0;C<7;C++)g.push(v),v=ze(v,1);m.push(g),g=[]}return m},n=l=>i.filter(y=>{const o=new Date(y.startTime);return K(l,o)}),d=l=>M(l,"d"),N=l=>{const y=i.filter(o=>{const x=new Date(o.startTime);return K(l,x)});return y.length===0?e.jsx("div",{className:"mt-1"}):e.jsx("div",{className:"mt-1 space-y-1",children:y.map(o=>{const x=ie[o.type]||ie.practice;return e.jsx("button",{onClick:m=>{m.stopPropagation(),$(o)},className:`
                w-full text-left px-1 py-0.5 rounded text-xs truncate
                ${b?"text-gray-100":"text-gray-900"}
                ${o.isCompleted?"opacity-50":""}
              `,style:{backgroundColor:o.color||"#3B82F6"},children:e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx(x,{size:12,className:"flex-shrink-0"}),e.jsx("span",{className:"truncate",children:o.title})]})},o.id)})})};return e.jsxs("div",{className:"w-full",children:[e.jsx("div",{className:"grid grid-cols-7 mb-1 text-center",children:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((l,y)=>e.jsx("div",{className:`
              py-2 text-sm font-medium
              ${b?"text-gray-400":"text-gray-700"}
            `,children:l},y))}),e.jsx("div",{className:"grid",children:j().map((l,y)=>e.jsx("div",{className:"grid grid-cols-7",children:l.map((o,x)=>{const m=n(o),g=Te(o,s),v=K(o,s),C=xe(o);return e.jsx("div",{onClick:()=>p(o),className:`
                    min-h-[100px] p-1 border-t border-l
                    ${y===5?"border-b":""}
                    ${x===6?"border-r":""}
                    ${b?"border-gray-700":"border-gray-200"}
                    ${g?b?"bg-gray-800":"bg-white":b?"bg-gray-900":"bg-gray-50"}
                    ${v?b?"bg-blue-900/30":"bg-blue-50":""}
                    transition-colors duration-200
                    cursor-pointer
                  `,children:e.jsxs("div",{className:"flex flex-col h-full",children:[e.jsx("div",{className:`
                        text-sm font-medium mb-1 h-6 w-6 flex items-center justify-center rounded-full
                        ${g?b?"text-gray-300":"text-gray-800":b?"text-gray-600":"text-gray-400"}
                        ${C?b?"bg-blue-600 text-white":"bg-blue-500 text-white":""}
                      `,children:d(o)}),e.jsxs("div",{className:"flex flex-col gap-1 overflow-hidden",children:[N(o),m.length>3&&e.jsxs("div",{className:`
                            text-xs px-2
                            ${b?"text-gray-400":"text-gray-500"}
                          `,children:["+",m.length-3," more"]})]})]})},x)})},y))})]})},He=({currentDate:s,onDateChange:i})=>{const{isDarkMode:p}=_(),$=()=>{i(ge(s,1))},b=()=>{i(he(s,1))},j=()=>{i(new Date)};return e.jsxs("div",{className:"flex items-center",children:[e.jsx("h1",{className:`
          text-2xl font-bold mr-4
          ${p?"text-gray-100":"text-gray-900"}
        `,children:M(s,"MMMM yyyy")}),e.jsxs("div",{className:"flex space-x-1",children:[e.jsx("button",{onClick:$,className:`
            p-2 rounded-lg
            ${p?"hover:bg-gray-700 text-gray-400 hover:text-gray-200":"hover:bg-gray-100 text-gray-500 hover:text-gray-700"}
            transition-colors
          `,children:e.jsx(ee,{size:20})}),e.jsx("button",{onClick:j,className:`
            p-2 rounded-lg
            ${p?"hover:bg-gray-700 text-gray-400 hover:text-gray-200":"hover:bg-gray-100 text-gray-500 hover:text-gray-700"}
            transition-colors
          `,children:e.jsx(ye,{size:20})}),e.jsx("button",{onClick:b,className:`
            p-2 rounded-lg
            ${p?"hover:bg-gray-700 text-gray-400 hover:text-gray-200":"hover:bg-gray-100 text-gray-500 hover:text-gray-700"}
            transition-colors
          `,children:e.jsx(de,{size:20})})]})]})},ce=({selectedDate:s,onChange:i,placeholder:p="Select Date",minDate:$,label:b,showTimeSelect:j=!0,iconLeft:n,iconRight:d,centered:N=!0})=>{const{isDarkMode:l}=_(),[y,o]=u.useState(!1),[x,m]=u.useState(new Date(s)),[g,v]=u.useState("date"),C=u.useRef(null),O=(t=>{const c=te(t),f=me(t);return Be({start:c,end:f})})(x),A=Ie(te(x));Array.from({length:24},(t,c)=>c),Array.from({length:12},(t,c)=>c*5),u.useEffect(()=>{const t=c=>{C.current&&!C.current.contains(c.target)&&o(!1)};return document.addEventListener("mousedown",t),()=>{document.removeEventListener("mousedown",t)}},[]);const F=t=>{t.preventDefault(),t.stopPropagation(),m(he(x,1))},w=t=>{t.preventDefault(),t.stopPropagation(),m(ge(x,1))},D=(t,c)=>{c.preventDefault(),c.stopPropagation();const f=new Date(s);f.setFullYear(t.getFullYear()),f.setMonth(t.getMonth()),f.setDate(t.getDate()),i(f),j?v("time"):o(!1)},P=t=>{t.preventDefault(),t.stopPropagation(),v("date")},L=t=>{t.preventDefault(),t.stopPropagation(),g==="date"&&j?v("time"):o(!1)},z=t=>$?t<$:!1,H=l?"bg-gray-800":"bg-white",k=l?"text-gray-100":"text-gray-900",E=l?"text-gray-400":"text-gray-500",T=l?"border-gray-700":"border-gray-200",I=l?"hover:bg-gray-700":"hover:bg-gray-100",W=l?"bg-gray-700":"bg-gray-50",a=t=>{t.preventDefault(),t.stopPropagation(),o(!y)};return e.jsxs("div",{className:"relative",ref:C,onClick:t=>t.stopPropagation(),children:[b&&e.jsx("label",{className:`block text-sm font-medium mb-1 ${l?"text-gray-300":"text-gray-700"}`,children:b}),e.jsxs("div",{className:"relative",children:[e.jsx("button",{type:"button",onClick:a,className:`
            w-full py-2 px-3 pr-9 rounded-lg
            ${W} ${k}
            focus:outline-none focus:ring-2 focus:ring-blue-500
            border ${T}
            text-left truncate
          `,children:s?M(s,j?"MMM d, yyyy h:mm aa":"MMM d, yyyy"):p}),n&&e.jsx("div",{className:"absolute left-3 top-1/2 transform -translate-y-1/2",children:n}),e.jsx("div",{className:`absolute right-3 top-1/2 transform -translate-y-1/2 ${E}`,children:d||e.jsx(le,{size:16})})]}),y&&e.jsxs("div",{onClick:t=>t.stopPropagation(),className:`
            z-40 ${H} rounded-lg shadow-xl border ${T}
            animate-fadeIn overflow-hidden w-64
            ${N?"fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2":"absolute mt-1"}
          `,children:[e.jsx("div",{className:`px-3 py-2 flex justify-between items-center border-b ${T}`,children:g==="date"?e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",onClick:w,className:`p-1 rounded-full ${I} ${E}`,children:e.jsx(ee,{size:16})}),e.jsx("h3",{className:`text-sm font-medium ${k}`,children:M(x,"MMMM yyyy")}),e.jsx("button",{type:"button",onClick:F,className:`p-1 rounded-full ${I} ${E}`,children:e.jsx(de,{size:16})})]}):e.jsxs(e.Fragment,{children:[e.jsxs("button",{type:"button",onClick:P,className:`p-1 rounded-full ${I} ${E} flex items-center`,children:[e.jsx(ee,{size:16}),e.jsx("span",{className:"ml-1",children:"Back"})]}),e.jsx("h3",{className:`text-sm font-medium ${k}`,children:b||"Select Time"}),e.jsx("div",{className:"w-6"})," "]})}),g==="date"&&e.jsxs("div",{className:"p-2",children:[e.jsx("div",{className:"grid grid-cols-7 mb-1",children:["Su","Mo","Tu","We","Th","Fr","Sa"].map(t=>e.jsx("div",{className:`text-center text-xs ${E} py-1`,children:t},t))}),e.jsxs("div",{className:"grid grid-cols-7 gap-1",children:[Array.from({length:A}).map((t,c)=>e.jsx("div",{className:"h-8"},`empty-${c}`)),O.map(t=>{const c=K(t,s),f=z(t),U=xe(t);return e.jsx("button",{type:"button",onClick:Y=>!f&&D(t,Y),disabled:f,className:`
                        flex items-center justify-center h-8 w-8 rounded-full mx-auto
                        ${c?"bg-blue-500 text-white":U?l?"border border-blue-500 text-blue-400":"border border-blue-500 text-blue-600":`${k} ${I}`}
                        ${f?"opacity-40 cursor-not-allowed":"cursor-pointer"}
                      `,children:M(t,"d")},t.toISOString())})]})]}),g==="time"&&e.jsx("div",{className:"p-3",children:e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsxs("div",{className:"mb-3 text-center",children:[e.jsx("h3",{className:`text-xl font-medium ${k}`,children:M(s,"h:mm aa")}),e.jsx("p",{className:`text-xs ${E}`,children:"Click on the clock to select time"})]}),e.jsx("div",{className:"relative mb-4",children:e.jsxs("div",{className:`
                    w-52 h-52 rounded-full
                    ${l?"bg-gray-700":"bg-gray-100"}
                    relative flex items-center justify-center
                    border ${T}
                  `,children:[e.jsxs("div",{className:"absolute inset-0 flex items-center justify-center",children:[e.jsx("div",{className:"absolute h-24 flex justify-center z-10",style:{transform:`rotate(${B(s)%12*30}deg)`},children:e.jsx("div",{className:"w-1.5 h-[40%] bg-blue-500 rounded-full shadow-sm"})}),e.jsx("div",{className:"absolute h-24 flex justify-center z-10",style:{transform:`rotate(${X(s)*6}deg)`},children:e.jsx("div",{className:"w-1 h-[60%] bg-blue-400 rounded-full shadow-sm"})}),e.jsx("div",{className:"w-3 h-3 rounded-full bg-blue-500 shadow-md z-20"})]}),[...Array(12)].map((t,c)=>{const f=c===0?12:c,Y=c*30*(Math.PI/180),G=Math.sin(Y)*80,Q=-Math.cos(Y)*80,r=(B(s)%12||12)===f;return e.jsx("button",{type:"button",onClick:h=>{h.preventDefault(),h.stopPropagation();const S=f===12?B(s)>=12?12:0:B(s)>=12?f+12:f,V=Z(s,S);i(V)},className:`
                            absolute w-8 h-8 rounded-full flex items-center justify-center
                            text-sm font-medium transition-colors duration-150
                            ${r?"bg-blue-500 text-white":`${l?"hover:bg-gray-600":"hover:bg-gray-200"} ${k}`}
                          `,style:{transform:`translate(${G}px, ${Q}px)`},children:f},f)})]})}),e.jsxs("div",{className:"mb-3 flex items-center space-x-2",children:[e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),t.stopPropagation();const c=B(s),f=c>=12?c-12:c;i(Z(s,f))},className:`
                      py-1 px-3 rounded-md text-sm
                      ${B(s)<12?"bg-blue-500 text-white":`${l?"bg-gray-700":"bg-gray-200"} ${k}`}
                    `,children:"AM"}),e.jsx("button",{type:"button",onClick:t=>{t.preventDefault(),t.stopPropagation();const c=B(s),f=c<12?c+12:c;i(Z(s,f))},className:`
                      py-1 px-3 rounded-md text-sm
                      ${B(s)>=12?"bg-blue-500 text-white":`${l?"bg-gray-700":"bg-gray-200"} ${k}`}
                    `,children:"PM"})]}),e.jsxs("div",{className:"w-full mb-4",children:[e.jsx("div",{className:"flex justify-between text-xs mb-1 px-6",children:[0,15,30,45,59].map(t=>e.jsxs("button",{type:"button",onClick:c=>{c.preventDefault(),c.stopPropagation(),i(oe(s,t))},className:`
                          py-1 px-1.5 rounded-md relative
                          ${X(s)===t?"text-blue-500 font-medium":E}
                          transition-all duration-150
                          hover:text-blue-500 hover:scale-110
                          hover:font-medium hover:-translate-y-0.5
                          focus:outline-none
                          group
                        `,children:[e.jsx("span",{children:t}),e.jsx("span",{className:`
                          absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full
                          ${X(s)===t?"bg-blue-500":"bg-transparent group-hover:bg-blue-500/50"}
                          transition-all duration-150
                        `})]},t))}),e.jsx("div",{className:"relative pt-2 flex justify-center",children:e.jsx("div",{className:"w-[calc(100%-53px)] relative ml-[-6px]",children:e.jsx("input",{type:"range",min:"0",max:"59",value:X(s),onChange:t=>{t.stopPropagation();const c=parseInt(t.target.value);i(oe(s,c))},className:"slider-time w-full",onClick:t=>t.stopPropagation()})})})]})]})}),e.jsx("div",{className:`px-3 py-2 border-t ${T} flex justify-end`,children:e.jsx("button",{type:"button",onClick:L,className:"px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200",children:g==="date"&&j?"Next":"Done"})}),N&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-25 -z-10",onClick:t=>{t.preventDefault(),t.stopPropagation(),o(!1)}})]})]})},We=[{name:"Blue",value:"#3B82F6"},{name:"Green",value:"#10B981"},{name:"Red",value:"#EF4444"},{name:"Purple",value:"#8B5CF6"},{name:"Yellow",value:"#F59E0B"},{name:"Pink",value:"#EC4899"}],Ye=({event:s,isOpen:i,onClose:p,onSave:$,selectedDate:b,sheetMusicItems:j})=>{var W;const{isDarkMode:n}=_(),d=!!s,[N,l]=u.useState(""),[y,o]=u.useState(""),[x,m]=u.useState(new Date),[g,v]=u.useState(J(new Date,1)),[C,R]=u.useState(!1),[O,A]=u.useState(void 0),[F,w]=u.useState("#3B82F6"),[D,P]=u.useState("practice"),[L,z]=u.useState(!1),H=[{type:"practice",icon:se,color:"#3B82F6",label:"Practice Session"},{type:"concert",icon:ae,color:"#10B981",label:"Concert"},{type:"lesson",icon:re,color:"#8B5CF6",label:"Lesson"},{type:"rehearsal",icon:ne,color:"#F59E0B",label:"Rehearsal"},{type:"recital",icon:q,color:"#EC4899",label:"Recital"}];u.useEffect(()=>{if(i){if(s)l(s.title),o(s.description),m(new Date(s.startTime)),v(new Date(s.endTime)),R(s.isCompleted),A(s.sheetMusicId),w(s.color||"#3B82F6"),P(s.type);else{const t=b||new Date;l(""),o(""),m(t),v(J(t,1)),R(!1),A(void 0),w("#3B82F6"),P("practice")}const a=setTimeout(()=>z(!0),50);return()=>clearTimeout(a)}else z(!1)},[i,s,b]);const k=a=>{a.preventDefault(),$({title:N,startTime:x,endTime:g,description:y,color:F,isCompleted:C,sheetMusicId:O,type:D}),z(!1),setTimeout(()=>p(),300)},E=()=>{z(!1),setTimeout(()=>p(),300)},T=a=>{a<=x?v(J(x,1)):v(a)},I=a=>{m(a),g<=a&&v(J(a,1))};return i?e.jsxs("div",{className:"fixed inset-0 flex items-center justify-center z-50",children:[e.jsx("div",{className:`
          fixed inset-0 bg-black transition-opacity duration-300
          ${L?"bg-opacity-50":"bg-opacity-0"}
        `,onClick:E}),e.jsxs("div",{className:`
          w-full max-w-md p-6 rounded-xl shadow-xl
          ${n?"bg-gray-800":"bg-white"}
          max-h-[90vh] overflow-y-auto
          transition-all duration-300 ease-out
          ${L?"opacity-100 scale-100":"opacity-0 scale-95"}
          relative z-10
        `,children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h2",{className:`text-xl font-bold ${n?"text-gray-100":"text-gray-900"}`,children:d?`Edit ${(W=H.find(a=>a.type===D))==null?void 0:W.label}`:"New Event"}),e.jsx("button",{onClick:E,className:`
              p-2 rounded-full
              ${n?"hover:bg-gray-700 text-gray-400 hover:text-gray-200":"hover:bg-gray-100 text-gray-500 hover:text-gray-700"}
              transition-colors
            `,children:e.jsx(ue,{size:20})})]}),e.jsxs("form",{onSubmit:k,children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:`block text-sm font-medium mb-2 ${n?"text-gray-300":"text-gray-700"}`,children:"Event Type"}),e.jsx("div",{className:"grid grid-cols-5 gap-2",children:H.map(a=>{const t=a.icon;return e.jsxs("button",{type:"button",onClick:()=>{P(a.type),w(a.color)},className:`
                      flex flex-col items-center justify-center p-3 rounded-lg
                      ${D===a.type?n?"bg-gray-700":"bg-gray-100":n?"hover:bg-gray-700/50":"hover:bg-gray-50"}
                      transition-colors
                    `,children:[e.jsx(t,{size:20,className:D===a.type?"text-blue-500":n?"text-gray-400":"text-gray-500"}),e.jsx("span",{className:`text-xs mt-1 ${n?"text-gray-300":"text-gray-700"}`,children:a.label})]},a.type)})})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{htmlFor:"title",className:`block text-sm font-medium mb-1 ${n?"text-gray-300":"text-gray-700"}`,children:"Title*"}),e.jsx("input",{id:"title",type:"text",value:N,onChange:a=>l(a.target.value),required:!0,placeholder:"Practice session title",className:`
                w-full py-2 px-3 rounded-lg
                ${n?"bg-gray-700 text-gray-100 border-gray-600":"bg-white text-gray-800 border-gray-300"}
                border focus:outline-none focus:ring-2 focus:ring-blue-500
              `})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{htmlFor:"description",className:`block text-sm font-medium mb-1 ${n?"text-gray-300":"text-gray-700"}`,children:"Description"}),e.jsx("textarea",{id:"description",value:y,onChange:a=>o(a.target.value),placeholder:"What do you plan to practice?",rows:3,className:`
                w-full py-2 px-3 rounded-lg resize-none
                ${n?"bg-gray-700 text-gray-100 border-gray-600":"bg-white text-gray-800 border-gray-300"}
                border focus:outline-none focus:ring-2 focus:ring-blue-500
              `})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 mb-4",children:[e.jsx("div",{children:e.jsx(ce,{label:"Start",selectedDate:x,onChange:I,iconRight:e.jsx(le,{size:16}),showTimeSelect:!0})}),e.jsx("div",{children:e.jsx(ce,{label:"End",selectedDate:g,onChange:T,iconRight:e.jsx(pe,{size:16}),showTimeSelect:!0,minDate:x})})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{htmlFor:"sheetMusic",className:`block text-sm font-medium mb-1 ${n?"text-gray-300":"text-gray-700"}`,children:"Sheet Music (Optional)"}),e.jsxs("div",{className:"relative",children:[e.jsxs("select",{id:"sheetMusic",value:O||"",onChange:a=>A(a.target.value||void 0),className:`
                  w-full py-2 pl-3 pr-10 rounded-lg appearance-none
                  ${n?"bg-gray-700 text-gray-100 border-gray-600":"bg-white text-gray-800 border-gray-300"}
                  border focus:outline-none focus:ring-2 focus:ring-blue-500
                `,children:[e.jsx("option",{value:"",children:"No sheet music"}),j.map(a=>e.jsxs("option",{value:a.id,children:[a.title," - ",a.composer]},a.id))]}),e.jsx(q,{size:16,className:`absolute right-3 top-3 ${n?"text-gray-400":"text-gray-500"}`})]})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:`block text-sm font-medium mb-2 ${n?"text-gray-300":"text-gray-700"}`,children:"Color"}),e.jsx("div",{className:"flex flex-wrap gap-2",children:We.map(a=>e.jsx("button",{type:"button",onClick:()=>w(a.value),className:`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${F===a.value?"ring-2 ring-offset-2 ring-gray-400":""}
                    ${n?"ring-offset-gray-800":"ring-offset-white"}
                  `,style:{backgroundColor:a.value},title:a.name,children:F===a.value&&e.jsx(be,{size:14,className:"text-white"})},a.value))})]}),d&&e.jsx("div",{className:"mb-4",children:e.jsxs("label",{className:"flex items-center",children:[e.jsx("input",{type:"checkbox",checked:C,onChange:a=>R(a.target.checked),className:"h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"}),e.jsx("span",{className:`ml-2 text-sm ${n?"text-gray-300":"text-gray-700"}`,children:"Mark as completed"})]})}),e.jsxs("div",{className:"flex justify-end gap-3 mt-6",children:[e.jsx("button",{type:"button",onClick:E,className:`
                py-2 px-4 rounded-lg text-sm font-medium
                ${n?"bg-gray-700 text-gray-300 hover:bg-gray-600":"bg-gray-100 text-gray-700 hover:bg-gray-200"}
                transition-colors
              `,children:"Cancel"}),e.jsx("button",{type:"submit",className:`
                py-2 px-4 rounded-lg text-sm font-medium
                bg-blue-600 text-white hover:bg-blue-700
                transition-colors
              `,children:d?"Update":"Create"})]})]})]})]}):null},Ve={practice:se,concert:ae,lesson:re,rehearsal:ne,recital:q},_e={practice:"Practice Session",concert:"Concert",lesson:"Lesson",rehearsal:"Rehearsal",recital:"Recital"},qe=({event:s,onEdit:i,onDelete:p,onToggleComplete:$,onClose:b,sheetMusicItem:j})=>{const{isDarkMode:n}=_(),[d,N]=u.useState(!1),l=Ve[s.type];u.useEffect(()=>{const m=setTimeout(()=>N(!0),50);return()=>clearTimeout(m)},[]);const y=()=>{N(!1),setTimeout(()=>b(),300)},o=()=>{N(!1),setTimeout(()=>p(),300)},x=()=>{const m=new Date(s.startTime),g=new Date(s.endTime);return m.getDate()===g.getDate()&&m.getMonth()===g.getMonth()&&m.getFullYear()===g.getFullYear()?e.jsxs(e.Fragment,{children:[e.jsx("span",{children:M(m,"EEEE, MMMM d, yyyy")}),e.jsx("span",{className:"mx-1",children:"•"}),e.jsxs("span",{children:[M(m,"h:mm a")," - ",M(g,"h:mm a")]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[M(m,"EEEE, MMMM d, yyyy")," • ",M(m,"h:mm a")]}),e.jsx("div",{children:"to"}),e.jsxs("div",{children:[M(g,"EEEE, MMMM d, yyyy")," • ",M(g,"h:mm a")]})]})};return e.jsxs("div",{className:"fixed inset-0 flex items-center justify-center z-50 p-4",children:[e.jsx("div",{className:`
          fixed inset-0 bg-black transition-opacity duration-300
          ${d?"bg-opacity-50":"bg-opacity-0"}
        `,onClick:y}),e.jsxs("div",{className:`
          w-full max-w-md p-6 rounded-xl shadow-xl
          ${n?"bg-gray-800":"bg-white"}
          transition-all duration-300 ease-out
          ${d?"opacity-100 scale-100":"opacity-0 scale-95"}
          relative z-10
        `,children:[e.jsx("div",{className:"absolute top-0 left-0 right-0 h-2 rounded-t-xl",style:{backgroundColor:s.color||"#3B82F6"}}),e.jsxs("div",{className:"mt-4",children:[e.jsx("button",{onClick:y,className:`
              absolute top-4 right-4 p-2 rounded-full
              ${n?"hover:bg-gray-700 text-gray-400 hover:text-gray-200":"hover:bg-gray-100 text-gray-500 hover:text-gray-700"}
              transition-colors
            `,children:e.jsx(ue,{size:20})}),e.jsx("div",{className:"flex items-center mb-4",children:e.jsx("button",{onClick:()=>$(!s.isCompleted),className:`
                flex items-center gap-2 px-3 py-1 rounded-full text-sm
                transition-colors
                ${s.isCompleted?n?"bg-green-900/30 text-green-400":"bg-green-100 text-green-700":n?"bg-gray-700 text-gray-300":"bg-gray-100 text-gray-700"}
              `,children:s.isCompleted?e.jsxs(e.Fragment,{children:[e.jsx(fe,{size:16}),e.jsx("span",{children:"Completed"})]}):e.jsxs(e.Fragment,{children:[e.jsx(ve,{size:16}),e.jsx("span",{children:"Not completed"})]})})}),e.jsxs("div",{className:`flex items-start gap-3 mb-4 ${n?"text-gray-300":"text-gray-700"}`,children:[e.jsx(l,{size:18,className:"mt-1"}),e.jsx("div",{className:"text-sm",children:_e[s.type]})]}),e.jsx("h2",{className:`text-xl font-bold mb-4 ${n?"text-gray-100":"text-gray-900"}`,children:s.title}),e.jsxs("div",{className:`flex items-start gap-3 mb-4 ${n?"text-gray-300":"text-gray-700"}`,children:[e.jsx(le,{size:18,className:"mt-1"}),e.jsx("div",{className:"text-sm",children:x()})]}),j&&e.jsxs("div",{className:`flex items-start gap-3 mb-4 ${n?"text-gray-300":"text-gray-700"}`,children:[e.jsx(q,{size:18,className:"mt-1"}),e.jsxs("div",{className:"text-sm",children:[e.jsx("p",{children:j.title}),e.jsx("p",{className:`${n?"text-gray-400":"text-gray-500"}`,children:j.composer})]})]}),s.description&&e.jsx("div",{className:`
              p-4 rounded-lg text-sm mt-6 mb-6
              ${n?"bg-gray-700/50 text-gray-300":"bg-gray-100 text-gray-700"}
            `,children:e.jsx("p",{className:"whitespace-pre-line",children:s.description})}),e.jsxs("div",{className:"flex justify-end gap-2 mt-6",children:[e.jsx("button",{onClick:o,className:`
                flex items-center gap-2 p-2 rounded-lg
                ${n?"bg-gray-700 text-red-400 hover:bg-gray-600":"bg-gray-100 text-red-600 hover:bg-gray-200"}
                transition-colors
              `,children:e.jsx(je,{size:18})}),e.jsxs("button",{onClick:i,className:`
                flex items-center gap-2 p-2 px-4 rounded-lg
                ${n?"bg-blue-600 text-white hover:bg-blue-700":"bg-blue-500 text-white hover:bg-blue-600"}
                transition-colors
              `,children:[e.jsx(Ne,{size:18}),e.jsx("span",{children:"Edit"})]})]})]})]})]})},Ue=()=>{const{isDarkMode:s}=_(),{user:i}=$e(),{showToast:p}=Ce(),[$,b]=u.useState(new Date),[j,n]=u.useState([]),[d,N]=u.useState(null),[l,y]=u.useState(!1),[o,x]=u.useState(!1),[m,g]=u.useState(null),[v,C]=u.useState([]),[R,O]=u.useState(!0),[A,F]=u.useState(!1),[w,D]=u.useState([]),[P,L]=u.useState(!1),z=[{type:"practice",label:"Practice Sessions"},{type:"concert",label:"Concerts"},{type:"lesson",label:"Lessons"},{type:"rehearsal",label:"Rehearsals"},{type:"recital",label:"Recitals"}],H=w.length>0?j.filter(r=>w.includes(r.type)):j,k=r=>{D(h=>h.includes(r)?h.filter(S=>S!==r):[...h,r])},E=()=>{D([])};u.useEffect(()=>{i&&(I(),W())},[i]);const T=r=>r.map(h=>({...h,type:h.type||"practice",color:h.color||"#3B82F6",description:h.description||""})),I=async()=>{if(i)try{O(!0);const r=await Ee(i.id),h=T(r);n(h)}catch(r){console.error("Error loading events:",r),p("Failed to load Practice Sessions","error")}finally{O(!1)}},W=async()=>{if(i)try{const r=await Oe(i.id);C(r)}catch(r){console.error("Error loading sheet music:",r)}},a=async r=>{if(i)try{F(!0);const h={...r,type:r.type||"practice",description:r.description||"",color:r.color||"#3B82F6"};if(d)await Me(i.id,{...h,id:d.id}),n(S=>S.map(V=>V.id===d.id?{...h,id:d.id}:V)),p("Practice Session updated successfully","success");else try{const S=await ke(i.id,h);n(V=>[...V,S]),p("Practice Session created successfully","success")}catch(S){throw console.error("Error in addEvent:",S),S}G()}catch(h){console.error("Error saving Practice Session:",h),p("Failed to save Practice Session","error")}finally{F(!1)}},t=async()=>{if(!(!i||!d))try{await Se(i.id,d.id),n(j.filter(r=>r.id!==d.id)),x(!1),N(null),p("Practice Session deleted successfully","success")}catch(r){console.error("Error deleting Practice Session:",r),p("Failed to delete Practice Session","error")}},c=async r=>{if(!(!i||!d)){if(r&&new Date(d.startTime)>new Date){p("Future events cannot be marked as completed","error");return}try{await De(i.id,d.id,r),n(j.map(h=>h.id===d.id?{...h,isCompleted:r}:h)),N({...d,isCompleted:r}),p(`Event marked as ${r?"completed":"incomplete"}`,"success")}catch(h){console.error("Error toggling Practice Session completion:",h),p("Failed to update Practice Session","error")}}},f=()=>{x(!1),y(!0)},U=r=>{N(r),x(!0)},Y=r=>{g(r),N(null),y(!0)},G=()=>{y(!1),N(null),g(null)},Q=()=>{if(d!=null&&d.sheetMusicId)return v.find(r=>r.id===d.sheetMusicId)};return e.jsx(Re,{children:e.jsxs("div",{className:`
        h-full overflow-hidden
        ${s?"bg-gray-900":"bg-gray-100"}
      `,children:[e.jsxs("div",{className:"max-w-7xl mx-auto p-6 h-full overflow-y-auto",children:[e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsx(He,{currentDate:$,onDateChange:b}),e.jsxs("div",{className:"relative",children:[e.jsxs("button",{onClick:()=>L(!P),className:`
                  flex items-center gap-2 py-2 px-4 rounded-lg
                  ${s?"bg-gray-800 text-gray-300 hover:bg-gray-700":"bg-white text-gray-700 hover:bg-gray-50"}
                  transition-colors shadow-sm
                `,children:[e.jsx(we,{size:16}),e.jsx("span",{children:"Filter"}),w.length>0&&e.jsx("span",{className:"bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full",children:w.length})]}),P&&e.jsx("div",{className:`
                    absolute right-0 mt-2 w-64 rounded-lg shadow-lg
                    ${s?"bg-gray-800":"bg-white"}
                    border ${s?"border-gray-700":"border-gray-200"}
                    z-50
                  `,children:e.jsxs("div",{className:"p-4",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h3",{className:`font-medium ${s?"text-gray-100":"text-gray-900"}`,children:"Filter Events"}),w.length>0&&e.jsx("button",{onClick:E,className:`
                            text-xs px-2 py-1 rounded
                            ${s?"text-blue-400 hover:text-blue-300":"text-blue-600 hover:text-blue-500"}
                          `,children:"Clear all"})]}),e.jsx("div",{className:"space-y-2",children:z.map(r=>e.jsxs("label",{className:`
                            flex items-center gap-2 p-2 rounded-lg cursor-pointer
                            ${w.includes(r.type)?s?"bg-gray-700":"bg-gray-100":""}
                            ${s?"hover:bg-gray-700":"hover:bg-gray-50"}
                          `,children:[e.jsx("input",{type:"checkbox",checked:w.includes(r.type),onChange:()=>k(r.type),className:"rounded border-gray-300 text-blue-600 focus:ring-blue-500"}),e.jsx("span",{className:s?"text-gray-300":"text-gray-700",children:r.label})]},r.type))})]})})]})]}),R?e.jsx("div",{className:`
              rounded-xl shadow-lg p-8 flex items-center justify-center
              ${s?"bg-gray-800":"bg-white"}
              min-h-[500px]
            `,children:e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"}),e.jsx("p",{className:`mt-4 ${s?"text-gray-300":"text-gray-600"}`,children:"Loading calendar events..."})]})}):e.jsx("div",{className:`
              rounded-xl shadow-lg overflow-hidden
              ${s?"bg-gray-800":"bg-white"}
            `,children:e.jsx(Le,{currentDate:$,events:H,onDateClick:Y,onEventClick:U})})]}),l&&e.jsx(Ye,{event:d||void 0,isOpen:l,onClose:G,onSave:a,selectedDate:m||void 0,sheetMusicItems:v}),o&&d&&e.jsx(qe,{event:d,onEdit:f,onDelete:t,onToggleComplete:c,onClose:()=>x(!1),sheetMusicItem:Q()})]})})},at=Ae(Ue,{message:"Practice Calendar Unavailable"});export{at as default};
