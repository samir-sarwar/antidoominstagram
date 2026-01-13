// Wrap everything in an async function, this ALLOWS homescreen access through Apple Shortcut
async function run() {
  const url = "https://www.instagram.com/direct/inbox/";
  const webView = new WebView();

  //Load the URL first
  await webView.loadURL(url);

  // Defin injection script
  const injectionJS = `
    (function() {
      const style = document.createElement('style');
      style.innerHTML = \`
        main[role='main'] > section, 
        div._aarp, 
        div._as8h, 
        nav[role='navigation'] div:not(:has(a[href*='/direct/'])) {
          display: none !important;
        }
      \`;
      document.head.appendChild(style);

      const backBtn = document.createElement('div');
      backBtn.innerHTML = '← Back';
      backBtn.style = "position: fixed; top: 80px; left: 15px; z-index: 10000; background: #262626; color: white; padding: 10px 18px; border-radius: 20px; font-weight: bold; border: 1px solid #555; font-family: -apple-system, sans-serif; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.5);";
      backBtn.onclick = () => { window.history.back(); };
      document.body.appendChild(backBtn);

      setInterval(() => {
        if (window.location.pathname === '/' || window.location.pathname.includes('reels')) {
          window.location.href = '/direct/inbox/';
        }
      }, 500);
      
      return null; // Ensure a clean return value
    })();
  `;

  //injnect then present view
  await webView.evaluateJavaScript(injectionJS);
  await webView.present(true);
}

await run();
