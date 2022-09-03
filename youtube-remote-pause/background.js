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
    chrome.tabs.query({ url: "https://*.youtube.com/*" }, (tabs) => {
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
  let contentFile = chrome.runtime.getManifest().content_scripts[0].js[0];
  let matches = chrome.runtime.getManifest().content_scripts[0].matches;

  for (let index = 0; index < tabs.length; index++) {
    let execute = false;
    matches.forEach(function (match) {
      let reg = match.replace(/[.+?^${}()|/[\]\\]/g, "\\$&").replace("*", ".*");
      if (new RegExp(reg).test(tabs[index].url) === true) {
        execute = true;
        return;
      }
    });

    if (execute) {
      try {
        chrome.tabs.executeScript(tabs[index].id, {
          file: contentFile
      });
      } catch (e) {}
    }
  }
});
