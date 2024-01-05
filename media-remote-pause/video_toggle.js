// Listen media commands from the service worker
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (!("action" in request)) {
    return false;
  }

  const player = document.querySelector('video');

  if (player) {
    const isPaused = player.paused;
    if (isPaused) {
      player.play();
    } else {
      player.pause();
    }
  }

});
