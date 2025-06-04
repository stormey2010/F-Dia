chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'getTabs') {
    chrome.tabs.query({ currentWindow: true }, tabs => {
      const results = tabs.map(t => ({
        id: t.id,
        title: t.title,
        favIcon: t.favIconUrl || '',
        url: t.url
      }));
      sendResponse({ tabs: results });
    });
    return true; 
  }
  else if (msg.action === 'scrapeTabs') {
    const ids = msg.tabs;
    const promises = ids.map(tabId =>
      chrome.scripting.executeScript({
        target: { tabId: Number(tabId) },
        world: "MAIN",
        func: () => document.documentElement.innerText
      })
    );
    Promise.all(promises)
      .then(results => {
        const texts = results.map(r => r[0].result);
        sendResponse({ texts });
      })
      .catch(err => {
        console.error(err);
        sendResponse({ texts: [], error: err.message });
      });
    return true; 
  }
});
