// Functionality to send messages to tabs
function sendMessage(tab, message) {
  if (!chrome.runtime.lastError) {
    chrome.tabs.sendMessage(tab.id, message, {}, function () {
      void chrome.runtime.lastError;
    });
  }
}

function toggle(tab) {
  sendMessage(tab, { action: "toggle" });
}

function queryTabs() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ url: ["https://*.youtube.com/*", "https://open.spotify.com/*"] }, (tabs) => {
      if (chrome.runtime.lastError)
        console.error(chrome.runtime.lastError);
      console.log('queryTabs', tabs)
      resolve(tabs);
    });
  });
}

// Listener for keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-play") {
    let tabs = await queryTabs();
    for (let i = 0; i < tabs.length; i++) {
      toggle(tabs[i]);
    }
  } else if (command === "toggle-play-local") {
    let tabs = await queryTabs();
    for (let i = 0; i < tabs.length; i++) {
      toggle(tabs[i]);
    }
  }
});

// Installer
chrome.runtime.onInstalled.addListener(async function installScript(details) {
  let tabs = await queryTabs();
  let contentFile;
  let contentScripts = chrome.runtime.getManifest().content_scripts;

  for (let index = 0; index < tabs.length; index++) {
    let execute = false;
    contentScripts.forEach(function (cs) {
      let reg = cs.matches[0].replace(/[.+?^${}()|/[\]\\]/g, "\\$&").replace("*", ".*");
      if (new RegExp(reg).test(tabs[index].url) === true) {
        contentFile = cs.js[0];
        execute = true;
        return;
      }
    });

    if (execute) {
      try {
        chrome.scripting.executeScript({
          target: { tabId: tabs[index].id },
          files: [contentFile]
        });

      } catch (e) { }
    }
  }
});
