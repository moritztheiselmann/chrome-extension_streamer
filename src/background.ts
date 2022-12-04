import { sendMessageToContentScript } from './messenger';
import { Messages } from './messages';
import { Message, MessageListener } from './types';

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
const requestScreenCapture = async (sender: chrome.runtime.MessageSender, data: Message<any>) => {
  console.log(`Received Screen Capturing Request form Content-Script: ${data}`);
  if (!sender) {
    return;
  }

  const tab = sender.tab;
  if (!tab) {
    return;
  }
  let response = <string>'';
  console.log('Requesting Screen Capture. Waiting for User input.');
  mediaRequestID = chrome.desktopCapture.chooseDesktopMedia(dataSources, tab, (streamID) => {
    // const tabID = tab?.id;
    // if (!tabID) {
    //   return;
    // }

    if (streamID) {
      // console.log('User has accepted Screen Capture.');
      response = 'Screen Capture Was Accepted By User';
      // sendMessageToContentScript(tabID, Messages.SS_DIALOG_SUCCESS, { message: 'Screen Capture Was Accepted By User' });
    }
    else {
      // console.log('User has declined Screen Capture.');
      response = 'Screen Capture Was Declined By User';
      // sendMessageToContentScript(tabID, Messages.SS_DIALOG_CANCEL, { message: 'Screen Capture Was Declined By User' });
    }
  });

  return { 
    message: response
  };
}

/**
 * 
 * @param sender 
 * @param data 
 * @returns 
 */
const cancelScreenCapture = (sender: chrome.runtime.MessageSender, data: Message<any>):void => { 
  if (mediaRequestID < 0) {
    return;
  }

  const tabID = sender?.tab?.id;
  if (!tabID) {
    return;
  }

  chrome.desktopCapture.cancelChooseDesktopMedia(mediaRequestID);
  mediaRequestID = -1;

  sendMessageToContentScript(tabID, Messages.SS_UI_CANCEL, { message: 'Screen Capture Was Stopped' });
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
 */
const init = ():void => {
  registerMessengerRequests();

  listenForMessages();
}

init();