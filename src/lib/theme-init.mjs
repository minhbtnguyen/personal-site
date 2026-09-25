// Applies the saved theme before first paint. Rendered inline in <head>; the
// CSP in astro.config.mjs allows it by hashing this exact source.
export const themeInit = "(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);if(t==='dark'){var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content','#121213');}}catch(e){}})();";
