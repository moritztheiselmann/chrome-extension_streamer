import { sendMessageToBackground } from "./messenger";
import { Messages } from './messages';
import { Message, MessageListener } from './types';

const requests = new Map<Messages, MessageListener>();

let streamID = <string>'';
const dialogSuccess = (sender: chrome.runtime.MessageSender, data: any, sendResponse: any)  => {
  if (!sender) {
    throw new Error('Received message contains no sender');
  }
  
  if (!data) {
    throw new Error('Received message contains no data.');
  }
  
  streamID = data.streamID;

  sendResponse(`received streamid: ${data.streamID}`);

  return true;
}

const dialogCancel = (sender: chrome.runtime.MessageSender, data: any, sendResponse: any)  => {
  sendResponse(`received message: ${data.data}`);

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