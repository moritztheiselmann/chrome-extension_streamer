import { sendMessageToBackground } from "./messenger";
import { Messages } from './messages';
import { Message, MessageListener } from './types';

const requests = new Map<Messages, MessageListener>();

const dialogSuccess = (sender: chrome.runtime.MessageSender, data: any, sendResponse: any)  => {
  if (!sender) {
    throw new Error('Received message contains no sender');
  }
  
  if (!data) {
    throw new Error('Received message contains no data.');
  }
  
  startScreenSteramFrom(data.streamID);

  sendResponse(`received streamid: ${data.streamID}`);

  return true;
}

const startScreenSteramFrom = async (streamID : string) => {
  const constraints = <MediaStreamConstraints>{
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: streamID
      }
    }
  };

  console.log(constraints);

  try {
    const stream = await (navigator.mediaDevices as any).getUserMedia(constraints);
    overlay.srcObject = stream; 
    overlay.play();
  }
  catch(err) {
    console.error(err);
  }

  // navigator.mediaDevices.getUserMedia(constraints)
  // .then(handleStreamSuccess)
  // .catch(handleStreamError);
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

const overlayWrapper = document.createElement('div');
overlayWrapper.className = 'video-capture-stream__overlay-wrapper';

const overlay = document.createElement('video');
overlay.className = 'video-capture-stream__overlay';
overlayWrapper.appendChild(overlay);

overlayWrapper.style.cssText = `
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 99999;

  display: flex;
  justify-content: center;
  
  align-items: center;
  pointer-events:none;
  touch-action: none;
  background-color: blue !important;
`;

overlay.style.cssText = `
  position: relative;
  width: 500px;
  height: 500px;
  background-color: blue !important;
`;

document.body.appendChild(overlay);

const init = ():void => {
  registerMessengerRequests();

  listenForMessages();
}

init();