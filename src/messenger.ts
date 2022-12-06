import { Messages } from './messages';

export const sendMessageToBackground = async (type: Messages, data: any = null) => {
  try {
    console.log(`send message to background: ${Messages[type]} | ${data.message}`);
    const response = await chrome.runtime.sendMessage({ type, data });
    console.log(`response: ${response}`);
    return response; 
  }
  catch(err) {
    console.error(`sendMessageToBackground error: ${err}`);
    return null;
  }
}

export const sendMessageToContentScript = async (tabID: number, type: Messages, data: any = null) => {
  try {
    console.log(`send message to content-script: tabID: ${tabID} | ${Messages[type]} | ${data}`);
    const response = await chrome.tabs.sendMessage(tabID, { type, data });
    console.log(`response: ${response}`);
    return response;
  }
  catch(err) {
    console.error(`sendMessageToContentScript error: ${err}`);
    return null;
  }
}