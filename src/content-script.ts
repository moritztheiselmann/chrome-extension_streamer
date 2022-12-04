
const port = chrome.runtime.connect(chrome.runtime.id);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message) {
    return;
  }

  if (message.type === 'SS_UI_REQUEST' || message.type === 'SS_UI_CANCEL') {
    if (!port) {
      return;
    }
    port.postMessage(message);
  }
},);

export {};
