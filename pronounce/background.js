const CONTEXT_MENU_ID1 = 'pronounce_selected_text';

chrome.contextMenus.create({
    title: 'Pronounce "%s"',
    contexts: ['selection'],
    id: CONTEXT_MENU_ID1
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === CONTEXT_MENU_ID1) {
        chrome.tts.speak(info.selectionText);
    }
});
