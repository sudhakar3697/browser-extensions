// Listen media commands from the service worker
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (!("action" in request)) {
    return false;
  }

  const element = document.querySelector('[data-testid="control-button-playpause"]');

  if (element) {
    element.click();
  }

});


// data-testid="control-button-skip-back"

// data-testid="control-button-skip-forward"