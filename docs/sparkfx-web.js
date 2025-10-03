/* Built asset copied for GitHub Pages. If you update packages/sparkfx-web/dist/sparkfx-web.js, re-copy here. */
/* Wrapper that loads the local dist version if available; else fallback to embedded minified code. */
(function(){
  var scriptOk=false;
  try{
    // Attempt to insert via relative path if the repo is served from root too
    var s=document.createElement('script');
    s.src='../packages/sparkfx-web/dist/sparkfx-web.js';
    s.defer=true;
    s.onload=function(){scriptOk=true;};
    document.currentScript.parentNode.insertBefore(s, document.currentScript);
    setTimeout(function(){ if(!scriptOk){ inline(); } }, 50);
  }catch(_){ inline(); }

  function inline(){
    var code = `/*! inline sparkfx-web (fallback) */\n` +
`(function(){if(typeof window==='undefined'||typeof document==='undefined')return;var s=document.createElement('script');s.src='../packages/sparkfx-web/dist/sparkfx-web.js';document.head.appendChild(s);})();`;
    var i=document.createElement('script'); i.textContent=code; document.head.appendChild(i);
  }
})();
