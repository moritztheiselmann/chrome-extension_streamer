export const sendMessageToBackground = async (type: any, data: any = null) => {
  try {
    const response = await chrome.runtime.sendMessage({ type, data });
    return response; 
  }
  catch(err) {
    console.error(`sendMessageToBackground error: ${err}`);
    return null;
  }
}

export const sendMessageToContentScript = async (tabID: number, type: any, data: any = null) => {
  try {
    const response = await chrome.tabs.sendMessage(tabID, { type, data });
    console.log(`response: ${response}`);
    return response;
  }
  catch(err) {
    console.error(`sendMessageToContentScript error: ${err}`);
  }
}