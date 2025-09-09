(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();const s=document.getElementById("root");s.innerHTML=`
  <div style="font-family:ui-sans-serif;line-height:1.3">
    <h1>Producción - Libros</h1>
    <div class="tabs"><button class="btn">Control general</button><button class="btn">Configuración</button></div>
    <div class="machine-card"><h3>Ricoh 8400 (ByN)</h3><p>Setup 3 min  Cierre 0 min</p></div>
  </div>
`;
