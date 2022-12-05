import { sendMessageToContentScript } from './messenger';
import { Messages } from './messages';
import { Message, MessageListener } from './types';



chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    toggleCapturing: false,
  }, () => {});
});

let toggleCapturing = false;
chrome.storage.sync.get([
  'toggleCapturing'
], (result) => {
  toggleCapturing = result.toggleCapturing;
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.toggleCapturing) {
      toggleCapturing = changes.toggleCapturing.newValue;
    }
  }
});

const requests = new Map<Messages, MessageListener>();

const registerMessengerRequests = ():void => {
  requests.set(Messages.SS_UI_REQUEST, requestScreenCapture);
  requests.set(Messages.SS_UI_CANCEL, cancelScreenCapture);
  requests.set(Messages.SS_IS_CAPTURING, isCapturing);
}

const dataSources = <string[]>['screen', 'window', 'tab'];
let mediaRequestID = <number> -1;
/**
 * 
 * @param sender 
 * @param data 
 * @returns 
 */
const requestScreenCapture = async (sender: chrome.runtime.MessageSender, data: Message<any>) => {
  console.log(`Received Screen Capturing Request form Content-Script: ${data}`);
  if (!sender) {
    return;
  }

  let tab;
  try {
    tab = await getCurrentTab();
  }
  catch(err) {
    console.error(`error getting current tab: ${err}`);
    return;
  }
  if (!tab) {
    return;
  }
  
  console.log('Requesting Screen Capture. Waiting for User input.');
  mediaRequestID = chrome.desktopCapture.chooseDesktopMedia(dataSources, tab, (streamID) => {
    if (streamID) {
      console.log('user agreed');
      capturing = true;
      return { 
        message:  'Screen Capture Was Declined By User'
      };
    }
    else {
      console.log('user declined');
      capturing = false;
      return { 
        message:  'Screen Capture Was Accepted By User'
      };
    }
  });
}

/**
 * 
 * @param sender 
 * @param data 
 * @returns 
 */
const cancelScreenCapture = (sender: chrome.runtime.MessageSender, data: Message<any>) => { 
  if (mediaRequestID < 0) {
    return;
  }

  if (!sender) {
    return;
  }

  // const tabID = sender?.tab?.id;
  // if (!tabID) {
  //   return;
  // }

  chrome.desktopCapture.cancelChooseDesktopMedia(mediaRequestID);
  mediaRequestID = -1;
  capturing = false;

  // sendMessageToContentScript(tabID, Messages.SS_UI_CANCEL, { message: 'Screen Capture Was Stopped' });
  
  return { 
    message:  'Screen Capture Was Stopped'
  };
}

let capturing = <boolean>false;
const isCapturing = (sender: chrome.runtime.MessageSender, data: Message<any>) => {
  if (!sender) {
    return;
  }

  console.log(capturing);

  return {
    message: capturing
  };
}

/**
 * 
 */
const listenForMessages = ():void => {
  chrome.runtime.onMessage.addListener((message, sender) => {
    const { type, data } = message;

    return requests.get(type)(sender, data);
  });
}

/**
 * 
 * @returns 
 */
const getCurrentTab = async() => {
  const querryOptions = {
    active: true,
    lastFocusedWindow: true,
    currentWindow: true
  };

  const [tab] = await chrome.tabs.query(querryOptions); 
  
  return tab;
}


/**
 * 
 */
const init = ():void => {
  registerMessengerRequests();

  listenForMessages();
}

init();