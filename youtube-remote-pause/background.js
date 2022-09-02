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

// Listener for keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-play") {
    let tabs = await chrome.tabs.query({ currentWindow: true });
    for (let i = 0; i < tabs.length; i++) {
      toggle(tabs[i]);
    }
  } else if (command === "toggle-play-local") {
    let tabs = await chrome.tabs.query({ currentWindow: true });
    for (let i = 0; i < tabs.length; i++) {
      toggle(tabs[i]);
    }
  }
});

// Installer
chrome.runtime.onInstalled.addListener(async function installScript(details) {
  let tabs = await chrome.tabs.query({ currentWindow: true });
  let contentFiles = chrome.runtime.getManifest().content_scripts[0].js;
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
        chrome.scripting.executeScript({
          target: { tabId: tabs[index].id },
          files: contentFiles,
        });
      } catch (e) {}
    }
  }
});
