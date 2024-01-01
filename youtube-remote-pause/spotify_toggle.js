// Listen media commands from the service worker
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  console.log('Test#123')
  if (!("action" in request)) {
    return false;
  }

  // Using document.querySelector to find the element
  const element = document.querySelector('[data-testid="control-button-playpause"]');

  // Check if the element is found
  if (element) {
    element.click();
  } else {
    console.log('Element not found');
  }
});


// data-testid="control-button-skip-back"

// data-testid="control-button-skip-forward"