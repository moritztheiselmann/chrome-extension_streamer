chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    console.log(`Received a message: ${message} | ${message.type}`);

    if (message.type === 'SS_UI_REQUEST') {
      requestScreenCapture(port, message)
    }
  
    else if (message.type === 'SS_UI_CANCEL') {
      cancelScreenCapture();
    } 
  });
});

const dataSources = <string[]>['screen', 'window', 'tab'];
let mediaRequestId = <number> -1;
const requestScreenCapture = (port : chrome.runtime.Port, message : any) => {
  const tab = port.sender?.tab;
  if (!tab) {
    return;
  }
  console.log('Requesting Screen Capture. Waiting for User input.');
  mediaRequestId = chrome.desktopCapture.chooseDesktopMedia(dataSources, tab, (streamId) => {
    if (streamId) {
      message.type = 'SS_DIALOG_SUCCESS';
      message.streamId = streamId;
      console.log('User has accepted Screen Capture.');
    }
    else {
      message.type = 'SS_DIALOG_CANCEL';
      console.log('User has declined Screen Capture.');
    }

    port.postMessage(message);
  });
}

const cancelScreenCapture = ():void => {
  if (mediaRequestId >= 0) {
    console.log(`Stopped screen capture for screen id: ${mediaRequestId}`);
    chrome.desktopCapture.cancelChooseDesktopMedia(mediaRequestId);
    mediaRequestId = -1;
  }
}

export {};

