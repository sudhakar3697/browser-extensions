const CONTEXT_MENU_ID = 'search_google_in_incognito_window';

chrome.contextMenus.create({
    title: 'Search Google for "%s" in incognito window',
    contexts: ['selection'],
    id: CONTEXT_MENU_ID
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === CONTEXT_MENU_ID) {
        const url = `https://www.google.com/search?q=${encodeURIComponent(info.selectionText)}`;
        chrome.windows.getCurrent((win) => {
            if (win.incognito) {
                chrome.tabs.create({
                    url
                });
            } else {
                chrome.windows.create({
                    url,
                    focused: true,
                    incognito: true,
                    state: 'maximized'
                });
            }
        });
    }
});
