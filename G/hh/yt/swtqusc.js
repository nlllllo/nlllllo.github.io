!function(n,e){for(var t in e)n[t]=e[t]}(window,function(n){var e={};function t(r){if(e[r])return e[r].exports;var a=e[r]={i:r,l:!1,exports:{}};return n[r].call(a.exports,a,a.exports,t),a.l=!0,a.exports}return t.m=n,t.c=e,t.d=function(n,e,r){t.o(n,e)||Object.defineProperty(n,e,{enumerable:!0,get:r})},t.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},t.t=function(n,e){if(1&e&&(n=t(n)),8&e)return n;if(4&e&&"object"==typeof n&&n&&n.__esModule)return n;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:n}),2&e&&"string"!=typeof n)for(var a in n)t.d(r,a,function(e){return n[e]}.bind(null,a));return r},t.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(e,"a",e),e},t.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},t.p="",t(t.s=9)}([function(n,e){n.exports={ERROR_SCRIPT:"1",ERROR_STYLE:"2",ERROR_IMAGE:"3",ERROR_AUDIO:"4",ERROR_VIDEO:"5",LOAD_ERROR_TYPE:{SCRIPT:"1",LINK:"2",IMG:"3",AUDIO:"4",VIDEO:"5"},ELEMENT_TYPE:"1",RESOURCE_ERROR:"1",IFRAME_IMGS_HIDDEN:"2",IFRAME_LOAD:"3",IFRAME_HIDDEN_IN_PARENT:"4",PARENT_WINDOW:"window",IFRAME_WINDOW:"iframe",ENVIRONMENT:"environment",ALL_IFRAMES:"5",IFRAME_UNLOAD:"6",LOG_URL:"https://eclick.baidu.com/rs.jpg",PACKET_MOST_LENGTH:1500,PAGE_SEARCH_ID:"pageSearchId",FILTER_IFRAMES_REGEXS:[/pos\.baidu\.com.*\?.{20,}/,/.*\?.*&swt=((1$)|(1\.\d$))/],ENCRYPT_IFRAMES_REGEXS:[/.*\?.*&swt=((1$)|(1\.\d$))/],FILTER_IMGS_MIN_WIDTH:2,FILTER_IMGS_MIN_HEIGHT:2}},function(n,e,t){"use strict";t.d(e,"a",(function(){return a}));var r={hasNewIframeLoad:!0,containers:[]},a={setMonitorData:function(n,e){r[n]||(r[n]=[]),r[n].push(e)},getMonitorData:function(n){return r[n]},getAllMonitorData:function(){return r},removeMonitorData:function(n,e){var t=r[n];if(t)if(e)for(var a=0,o=t.length;a<o;a++)e===t[n]&&t.splice(a,1);else r[n]=null},clear:function(){r={}},setOneMonitorData:function(n,e){r[n]=e}}},function(n,e,t){"use strict";t.d(e,"e",(function(){return i})),t.d(e,"b",(function(){return c})),t.d(e,"a",(function(){return u})),t.d(e,"f",(function(){return f})),t.d(e,"c",(function(){return s})),t.d(e,"d",(function(){return d}));var r=t(0);function a(n){return function(n){if(Array.isArray(n))return o(n)}(n)||function(n){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(n))return Array.from(n)}(n)||function(n,e){if(!n)return;if("string"==typeof n)return o(n,e);var t=Object.prototype.toString.call(n).slice(8,-1);"Object"===t&&n.constructor&&(t=n.constructor.name);if("Map"===t||"Set"===t)return Array.from(n);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return o(n,e)}(n)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(n,e){(null==e||e>n.length)&&(e=n.length);for(var t=0,r=new Array(e);t<e;t++)r[t]=n[t];return r}function i(n){return n.nodeType+""===r.ELEMENT_TYPE}function c(n){return n?n.toString().split("_")[1]:""}function u(){return!!(window.postMessage&&window.addEventListener&&URL)}function f(n,e){return n.test(e)}function s(){var n=a(document.getElementsByTagName("meta")).find((function(n){return"template-name"===n.name}));return n&&n.content?n.content:""}function d(n){return new URL(n)}},function(n,e,t){"use strict";function r(n){try{window.parent.postMessage(JSON.stringify(n),"*")}catch(n){console.log("postMessageToParent has error:",n)}}t.d(e,"a",(function(){return r}))},function(n,e,t){"use strict";t.d(e,"a",(function(){return f}));var r=t(0),a=t.n(r),o=t(1),i=t(3),c=t(2),u=window.location.href;function f(n){window.addEventListener&&window.addEventListener("error",(function(e){!function(n,e){try{var t=n.target,r=t.nodeName&&t.nodeName.toUpperCase();if(r&&a.a.LOAD_ERROR_TYPE[r]){var f=a.a.LOAD_ERROR_TYPE[r],d=t.src||t.href;if(e===a.a.PARENT_WINDOW){var l=s(a.a.PARENT_WINDOW,f);_={type:l,errorSrc:d},o.a.setMonitorData(_.type,_)}else if(e===a.a.IFRAME_WINDOW){!function(n){Object(i.a)(n)}({type:s(a.a.IFRAME_WINDOW,f),errorSrc:d,windowsHref:u,templateName:Object(c.c)()})}}}catch(n){var E=n&&n.stack?n.stack:n;(new Image).src="//eclick.baidu.com/rs.jpg?type=parentMonitor&mes="+encodeURIComponent(E)}var _}(e,n)}),!0)}function s(n,e){return n+"_"+a.a.RESOURCE_ERROR+"_"+e}},function(n,e,t){"use strict";var r=t(0),a=t(1);e.a=function(n){var e,t,o,i,c=(e=window.location.href,o=(new Date).getTime(),i=Math.random().toString(36).slice(2),t=o+i,{type:r.ENVIRONMENT,deliveryPageUrl:e,pageSearchId:t});a.a.setMonitorData(c.type,c)}},function(n,e,t){"use strict";var r=t(4),a=t(0),o=t.n(a),i=t(1),c=t(2);function u(n){try{var e=JSON.parse(n.data),t=Object(c.b)(e.type);t&&(t===o.a.RESOURCE_ERROR?(a=e,i.a.setMonitorData(a.type,a)):t===o.a.IFRAME_IMGS_HIDDEN?function(n){i.a.setMonitorData(n.type,n)}(e):t===o.a.IFRAME_LOAD&&function(n){i.a.setOneMonitorData("hasNewIframeLoad",!0),i.a.setMonitorData(n.type,n)}(e))}catch(n){var r=n&&n.stack?n.stack:n;(new Image).src="//eclick.baidu.com/rs.jpg?type=parentMonitor&mes="+encodeURIComponent(r)}var a}function f(n,e){return e.some((function(e){return Object(c.f)(e,n)}))}function s(){var n=function(n,e){var t=[];return Array.prototype.forEach.call(n,(function(n){f(n.src,e)&&t.push(n)})),t}(document.getElementsByTagName("iframe"),a.FILTER_IFRAMES_REGEXS),e=[];return n.forEach((function(n){var t=n.clientHeight<=0?function(n){var e=n,t={},r=!1,a=!1,o=[];for(;Object(c.e)(e);){if("none"===window.getComputedStyle(e).display&&(t={hiddenElementObj:{nodeName:e.nodeName,nodeId:e.id,nodeClass:e.className},isMediaDom:a,blocked:1},r=!0),!a&&o.push((void 0,{allAttributeNames:(i=e).getAttributeNames(),nodeName:i.nodeName,nodeId:i.id,nodeClass:i.className})),d(e)&&(a=!0),r&&a){t.isMediaDom||(t.containerSelector=o);break}e=e.parentNode}var i;return t}(n):{blocked:0};e.push(t)})),{type:a.PARENT_WINDOW+"_"+a.IFRAME_HIDDEN_IN_PARENT,iframes:e}}function d(n){return i.a.getMonitorData("containers").find((function(e){return e===n}))}var l=function(){var n,e,t,r=a.PARENT_WINDOW+"_"+a.ALL_IFRAMES,o=(t=document.getElementsByTagName("iframe"),n=Array.prototype.map.call(t,(function(n){return n.src})),e=a.FILTER_IFRAMES_REGEXS,n.filter((function(n){return f(n,e)}))),i={};return o.length>0&&(i={type:r,allIframeSrc:o}),i};e.a=function(n,e){window.addEventListener("load",(function(){try{var n=s();n.iframes.length>0&&i.a.setMonitorData(n.type,n);var e=l();e&&i.a.setMonitorData(e.type,e)}catch(n){var t=n&&n.stack?n.stack:n;(new Image).src="//eclick.baidu.com/rs.jpg?type=parentMonitor&mes="+encodeURIComponent(t)}})),"blocked"===e&&(Object(r.a)(a.PARENT_WINDOW),window.addEventListener&&window.addEventListener("message",u))}},function(n,e,t){"use strict";var r=t(1),a=t(0),o=t.n(a),i=t(2);function c(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}var u="",f=!0,s=!0;function d(){var n,e=(c(n={},o.a.PAGE_SEARCH_ID,_()),c(n,"needUpload",!1),n);return function(n){for(var e=r.a.getAllMonitorData(),t=0,a=Object.keys(e);t<a.length;t++){var o=a[t],i=p(o);i&&(function(n){return!!n.split("_")[2]}(c=o)&&"iframe"===c.split("_")[0]||M(o)||A(o))&&(n[o]=i,I(o),n.needUpload=!0)}var c}(e),function(n){var e=N("unloadIframeType"),t=function(){var n=N("allIframesType"),e=r.a.getMonitorData(n),t=N("loadIframesType"),a=r.a.getMonitorData(t),o=[];if(e&&e[0]&&e[0].allIframeSrc)for(var c=e[0].allIframeSrc,u=0,f=c.length;u<f;u++)if(!R(a,c[u])){var s=Object(i.d)(c[u]);o.push({iframeDomain:s.hostname,iframePathLen:s.pathname.length-1})}return o}();t.length&&r.a.getMonitorData("hasNewIframeLoad")&&(n[e]=t,n.needUpload=!0,r.a.setOneMonitorData("hasNewIframeLoad",!1))}(e),l(e,"blocked"),E(e),e}function l(n,e){var t=N("allIframesType"),a=r.a.getMonitorData(t),c=a&&a[0]&&a[0].allIframeSrc;s&&c&&(n[t]={type:e,antiBlock:{},antiBlockNoBlock:0,noAntiBlock:0},c.forEach((function(e){var r=Object(i.d)(e),a=r.hostname;!function(n){return o.a.ENCRYPT_IFRAMES_REGEXS.some((function(e){return Object(i.f)(e,n)}))}(e)?"/s"===r.pathname?n[t].antiBlockNoBlock+=1:n[t].noAntiBlock+=1:(n[t].antiBlock[a]||(n[t].antiBlock[a]=[]),n[t].antiBlock[a].push(r.pathname.length-1))})),s=!1,n.needUpload=!0)}function E(n){f&&(f=!1,n[o.a.ENVIRONMENT]=m(),n.needUpload=!0)}function _(){if(u)return u;var n=m();return u=n&&n[0]&&n[0].pageSearchId}function m(){return r.a.getMonitorData(o.a.ENVIRONMENT)}function p(n){var e="";try{e=JSON.parse(JSON.stringify(r.a.getMonitorData(n)))}catch(n){var t=n&&n.stack?n.stack:n;(new Image).src="//eclick.baidu.com/rs.jpg?type=JSON_API&mes="+encodeURIComponent(t)}return e}function I(n){r.a.removeMonitorData(n)}function R(n,e){var t=-1;if(n instanceof Array)for(var r=0,a=n.length;r<a;r++)if(n[r].iframeHref===e){t=r;break}return t>-1}function M(n){return n===N("hiddenImgsType")}function A(n){return n===N("hiddenIframeType")}function N(n){return{hiddenImgsType:o.a.IFRAME_WINDOW+"_"+o.a.IFRAME_IMGS_HIDDEN,hiddenIframeType:o.a.PARENT_WINDOW+"_"+o.a.IFRAME_HIDDEN_IN_PARENT,allIframesType:o.a.PARENT_WINDOW+"_"+o.a.ALL_IFRAMES,loadIframesType:o.a.IFRAME_WINDOW+"_"+o.a.IFRAME_LOAD,unloadIframeType:o.a.PARENT_WINDOW+"_"+o.a.IFRAME_UNLOAD}[n]}function O(n){for(var e="",t="",r=0,a=n.length;r<a;r+=2)e+=n.charAt(r),r+1<a&&(t+=n.charAt(r+1));return e+t}function v(n,e,t){return"FF"+e+t+n+"AA"}function y(n){var e=n+"";return n<10&&(e="0"+n),e}function g(n){var e=new Image,t="baidu_monitor_log_"+(new Date).getTime();window[t]=e,e.onload=e.onerror=e.onabort=function(){try{delete window[t]}catch(n){window[t]=null}e=null},e.src=n}e.a=function(n){setInterval(D,2e3,n)};function D(n){try{var e="blocked"===n?d():function(){for(var n,e=r.a.getAllMonitorData(),t=(c(n={},o.a.PAGE_SEARCH_ID,_()),c(n,"needUpload",!1),n),a=0,i=Object.keys(e);a<i.length;a++){var u=i[a],f=p(u);f&&A(u)&&(t[u]=f,I(u),t.needUpload=!0)}return l(t,"unblocked"),E(t),t}(),t=e[a.PAGE_SEARCH_ID],i=JSON.stringify(e);if(e.needUpload)if(i.length>a.PACKET_MOST_LENGTH)for(var u=function(n){for(var e=n.length,t=0,r=a.PACKET_MOST_LENGTH,o=Math.ceil(e/a.PACKET_MOST_LENGTH),i=[],c=1;r<=e;){var u=v(O(n.slice(t,r)),y(o),y(c));if(i.push(u),c++,r===e)break;t=r,r=Math.min(t+a.PACKET_MOST_LENGTH,e)}return i}(i),f=(new Date).getTime(),s=0,m=u.length;s<m;s++){g(b(t,f,encodeURIComponent(u[s])))}else g(function(n,e){return a.LOG_URL+"?"+a.PAGE_SEARCH_ID+"="+n+"&content="+e}(t,encodeURIComponent(O(i))))}catch(n){var R=n&&n.stack?n.stack:n;(new Image).src="//eclick.baidu.com/rs.jpg?type=parentMonitor&mes="+encodeURIComponent(R)}}function b(n,e,t){return a.LOG_URL+"?"+a.PAGE_SEARCH_ID+"="+n+"&timestamp="+e+"&content="+t}},,function(n,e,t){"use strict";t.r(e),t.d(e,"unblockedMonitor",(function(){return u})),t.d(e,"setPresentContainer",(function(){return f}));var r=t(5),a=t(7),o=t(2),i=t(6),c=t(1);function u(n){if(o.a)try{!function(n){c.a.removeMonitorData("containers"),c.a.setMonitorData("containers",n.container),Object(r.a)(),Object(i.a)(n.container,"unblocked"),Object(a.a)("unblocked")}(n)}catch(n){var e=n&&n.stack?n.stack:n;(new Image).src="//eclick.baidu.com/rs.jpg?type=unblockedMonitor&mes="+encodeURIComponent(e)}}function f(n){c.a.setMonitorData("containers",n)}window.___baidu_union=window.___baidu_union||{},window.___baidu_union.unblockedMonitor=u,window.___baidu_union.setPresentContainer=f}]));