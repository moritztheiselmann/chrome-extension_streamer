import { sendMessageToBackground } from "./messenger";
import { Messages } from './messages';
import { Message, MessageListener } from './types';

const requests = new Map<Messages, MessageListener>();

const requestCapturing = async (sender: chrome.runtime.MessageSender, data: Message<any>)  => {
  console.log(`received from popup: ${data}`);
  let response = undefined;
  try {
    response = await sendMessageToBackground(
      Messages.SS_UI_REQUEST,
      {
        message: 'Initialise Screen Capture'
      }
    );

    console.log(`response: ${response}`);
  }
  catch(err) {
    console.error(`error: ${err}`);
  }

  return {
    message: response
  }
}

const cancelCapturing = (sender, data):void => {
  console.log(`received from popup: ${data}`);
}

const dialogSuccess = (sender, data):void => {
  console.log(`received from background: ${data}`);
}

const dialogCancel = (sender, data):void => {
  console.log(`received from background: ${data}`);
}

const registerMessengerRequests = ():void => {
  requests.set(Messages.SS_UI_REQUEST, requestCapturing);
  requests.set(Messages.SS_UI_CANCEL, cancelCapturing);
  requests.set(Messages.SS_DIALOG_SUCCESS, dialogSuccess);
  requests.set(Messages.SS_DIALOG_CANCEL, dialogCancel);
}

const listenForMessages = () => {
  chrome.runtime.onMessage.addListener((message, sender) => {
    const { type, data } = message;
    return requests.get(type)(sender, data);
  });
}

const init = ():void => {
  registerMessengerRequests();

  listenForMessages();
}

init();


// const port = chrome.runtime.connect(chrome.runtime.id);

// // listen to messages from background
// port.onMessage.addListener((message) => {
//   if (!message) {
//     return;
//   }

//   if (message.type === Messages.SS_DIALOG_SUCCESS || message.tpye === Messages.SS_DIALOG_CANCEL) {
//     window.postMessage(message, '*');
//   }
// });

// // listen to messages from pop-up
// // acts as middlemen between popup and background
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (!message) {
//     return;
//   }

//   if (message.type === Messages.SS_UI_REQUEST || message.type === Messages.SS_UI_CANCEL) {
//     if (!port) {
//       return;
//     }
//     port.postMessage(message);
//   }

//   sendResponse(`Received message ${message.type}`);

//   return true;
// });

// export {};
