import { sendMessageToBackground } from "./messenger";
import { Messages } from './messages';
import { Message, MessageListener } from './types';

const requests = new Map<Messages, MessageListener>();

const streamID = <string>'';

const dialogSuccess = (sender: chrome.runtime.MessageSender, message: Message<any>, sendResponse: any)  => {
  if (!sender) {
    throw new Error('Received message contains no sender');
  }
  
  if (!message) {
    throw new Error('Received message contains no message.');
  }
  
  streamID = message.streamID;

  sendResponse(`received streamid: ${message.streamID}`);

  return true;
}

const dialogCancel = (sender: chrome.runtime.MessageSender, message: Message<any>, sendResponse: any)  => {
  sendResponse(`received message: ${message.data}`);

  return true;
}

const registerMessengerRequests = ():void => {
  requests.set(Messages.SS_DIALOG_SUCCESS, dialogSuccess);
  requests.set(Messages.SS_DIALOG_CANCEL, dialogCancel);
}

const listenForMessages = () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message) {
      throw new Error('No message appended.');
    }
    
    const { type, data } = message;
    const request = requests.get(type);
    if (!request) {
      throw new Error('Request does not exist.');
    }

    return request(sender, data, sendResponse);
  });
}

const init = ():void => {
  registerMessengerRequests();

  listenForMessages();
}

init();