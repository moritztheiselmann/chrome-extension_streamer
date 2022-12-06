import { sendMessageToContentScript } from './messenger';
import { Messages } from './messages';
import { Message, MessageListener } from './types';


let toggleCapturing = false;
chrome.runtime.onInstalled.addListener(() => {
  setToggleCapturing(false);
});

chrome.storage.local.get(['toggleCapturing'], (result) => {
  toggleCapturing = result.toggleCapturing;
  console.log("Value currently is " + result.toggleCapturing);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.toggleCapturing) {
      toggleCapturing = changes.toggleCapturing.newValue;
    }
  }
});

const setToggleCapturing = (value: boolean) => {
  chrome.storage.local.set({
    toggleCapturing: value
  })
  .then(() => {
    console.log(`toggleCapturing is set to + ${value}`);
  });
}

const requests = new Map<Messages, MessageListener>();

const registerMessengerRequests = ():void => {
  requests.set(Messages.SS_UI_REQUEST, requestScreenCapture);
  requests.set(Messages.SS_UI_CANCEL, cancelScreenCapture);
}

const dataSources = <string[]>['screen', 'window', 'tab'];
let mediaRequestID = <number> -1;
/**
 * 
 * @param sender 
 * @param data 
 * @returns 
 */
const requestScreenCapture = async (sender: chrome.runtime.MessageSender, data: any, sendResponse: any) => {
  if (!sender) {
    throw new Error('Sender does not exist.');
  }

  let tab;
  try {
    tab = await getCurrentTab();
  }
  catch(err) {
    // console.error(`error getting current tab: ${err}`);
    throw new Error(`Error getting ncurrent tab: ${err}`);
  }

  console.log('Requesting Screen Capture. Waiting for User input.');

  mediaRequestID = chrome.desktopCapture.chooseDesktopMedia(dataSources, tab, (streamID) => {
    if (streamID) {
      console.log('user accepted');
      sendResponse('accepted');
      setToggleCapturing(true);
    }
    else {
      console.log('user declined');
      sendResponse('decliend');
      setToggleCapturing(false);
    }
  });

  return true;
}

/**
 * 
 * @param sender 
 * @param data 
 * @returns 
 */
const cancelScreenCapture = (sender: chrome.runtime.MessageSender, data: any, sendResponse: any) => { 
  if (mediaRequestID < 0) {
    // return;
    throw new Error(`System is not capturing any screen. MediaRequestID: ${mediaRequestID}`);
  }

  if (!sender) {
    // return;
    throw new Error('Sender does not exist.');
  }

  chrome.desktopCapture.cancelChooseDesktopMedia(mediaRequestID);
  mediaRequestID = -1;
  // sendMessageToContentScript(tabID, Messages.SS_UI_CANCEL, { data: 'Screen Capture Was Stopped' });
  
  sendResponse('Screen Capture Has Stopped');

  return true;
  // return { 
  //   data:  'Screen Capture Was Stopped'
  // };
}

/**
 * 
 */
const listenForMessages = () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message) {
      throw new Error('No message appended.');
      // return;
    }
    
    const { type, data } = message;
    const request = requests.get(type);
    if (!request) {
      throw new Error('Rquest does not exist.');
      // return;
    }

    return request(sender, data, sendResponse);
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