import{j as e}from"./ui-DgCwhHkT.js";import{a as i}from"./index-CFOCruvU.js";const g=({isOn:s,onToggle:n,disabled:r=!1})=>{const{isDarkMode:t}=i();return e.jsx("button",{onClick:n,disabled:r,className:`
        relative inline-flex h-6 w-11 items-center rounded-full
        transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${s?t?"bg-blue-600":"bg-blue-500":t?"bg-gray-700":"bg-gray-300"}
        ${r?"opacity-50 cursor-not-allowed":"cursor-pointer"}
      `,children:e.jsx("span",{className:`
          inline-block h-4 w-4 transform rounded-full bg-white transition duration-300
          ${s?"translate-x-6":"translate-x-1"}
        `})})},u=({icon:s,title:n,description:r,control:t,onClick:o})=>{const{isDarkMode:a}=i();return e.jsxs("div",{className:`
        flex items-center justify-between p-5 rounded-lg mb-4
        ${o?"cursor-pointer":""}
        ${a?"bg-gray-800 hover:bg-gray-700":"bg-white hover:bg-gray-50"}
        transition-colors duration-200
      `,onClick:o,children:[e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:a?"text-gray-400":"text-gray-600",children:s}),e.jsxs("div",{children:[e.jsx("h3",{className:`font-medium mb-1 ${a?"text-gray-200":"text-gray-800"}`,children:n}),r&&e.jsx("p",{className:`text-sm ${a?"text-gray-400":"text-gray-600"}`,children:r})]})]}),t&&e.jsx("div",{children:t})]})};export{u as S,g as T};
