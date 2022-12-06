import { sendMessageToBackground } from "./messenger";
import { Messages } from './messages';
import { Message, MessageListener } from './types';

const requests = new Map<Messages, MessageListener>();

// const requestCapturing = async (sender: chrome.runtime.MessageSender, message: Message<any>)  => {
//   let response = undefined;
//   try {
//     response = await sendMessageToBackground(
//       Messages.SS_UI_REQUEST,
//       {
//         data: 'Initialise Screen Capture'
//       }
//     );

//     console.log(`response: ${response}`);
//   }
//   catch(err) {
//     console.error(`error: ${err}`);
//   }

//   return {
//     data: response
//   }
// }

// const cancelCapturing = (sender: chrome.runtime.MessageSender, message: Message<any>)  => {
// }

// const dialogSuccess = (sender: chrome.runtime.MessageSender, message: Message<any>)  => {
// }

// const dialogCancel = (sender: chrome.runtime.MessageSender, message: Message<any>)  => {
// }

// const registerMessengerRequests = ():void => {
//   requests.set(Messages.SS_UI_REQUEST, requestCapturing);
//   requests.set(Messages.SS_UI_CANCEL, cancelCapturing);
//   requests.set(Messages.SS_DIALOG_SUCCESS, dialogSuccess);
//   requests.set(Messages.SS_DIALOG_CANCEL, dialogCancel);
// }

// const listenForMessages = () => {
//   chrome.runtime.onMessage.addListener((message, sender) => {
//     const { type, data } = message;
//     return requests.get(type)(sender, data);
//   });
// }

const init = ():void => {
  // registerMessengerRequests();

  // listenForMessages();
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
