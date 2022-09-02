// Listen media commands from the service worker
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (!("action" in request)) {
    return false;
  }
  var videoElements = document.querySelectorAll("video");

  for (i = 0; i < videoElements.length; i++) {
    if (request.action === "toggle") {
      if (videoElements[i] && videoElements[i].paused) {
        await videoElements[i].play();
      } else {
        videoElements[i].pause();
      }
    }
  }
  return true;
});
