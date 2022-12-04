<script setup lang="ts">
  import { ref } from 'vue';
  
  const extensionIsInstalled = ref(<Boolean> false);

  // send messages to content-script
  const startCapturing = ():void => {
    console.log('should start screen capture');

    const message = { 
      type: 'SS_UI_REQUEST'
    };
    sendMessage(message);
  }

const getCurrentTab = async() => {
  const querryOptions = {
    active: true,
    lastFocusedWindow: true,
    currentWindow: true
  };

  const [tab] = await chrome.tabs.query(querryOptions); 
  
  return tab;
}

const stopCapturing = async () => {
  console.log('should stop screen capture');

  const message = { 
      type: 'SS_UI_CANCEL'
    };
    sendMessage(message);
}

const sendMessage = async (message: Object):Promise<void> => {
  if (!message) {
    return;
  }

  try {
      const tab = await getCurrentTab();
      console.log(tab);
      const tabId = <number> tab.id;
        console.log(tabId)
      chrome.tabs.sendMessage(tabId, message, () => {
        console.log(`send message ${message} from tab: ${tabId}`);
      });
    }
    catch(err) {
      console.log(`Failed getting current tab: ${err}`);
    }
}

window.addEventListener('message', (event: MessageEvent) =>{
  if (event.origin !== window.location.origin) {
    return;
  }

  if (!event.data.type) {
    return;
  }

  console.log(`Received a message: ${event.data.type}`);
});

  // listen to messages from content-script
  // window.addEventListener('message', (event: MessageEvent) => {
  //   // ignore every but our own message
  //   if (event.origin !== window.location.origin) {
  //     return;
  //   }

  //   if (!event.data.type) {
  //     return;
  //   }

  //   if (event.data.type === 'SS_PING') {
  //     extensionIsInstalled.value = true;
  //   }

  //   // if (event.data.type === 'SS_DIALOG_SUCCESS') {
  //   //   startScreenStreamFrom(event.data.streamId);
  //   // }

  //   // if (event.data.type === 'SS_DIALOG_CANCEL') {
  //   //   console.log('User cancelled');
  //   // }
  // });

  // const handleSuccess = (stream : any) => {
  //   // 
  // }

  // const handleError = (error : Error) => {
  //   console.error(`getUserMedia() failed: ${error}`);
  // }
  
  // const startScreenStreamFrom = (streamId : number) => {
  //   const constraints = <Object> {
  //     audio: false,
  //     video: {
  //       mandatory: {
  //         chromeMediaSource: 'desktop',
  //         chromeMediaSourceId: streamId,
  //         maxWidth: window.screen.width,
  //         maxHeight: window.screen.height
  //       }
  //     }
  //   };

  //   navigator.mediaDevices.getUserMedia(constraints)
  //     .then(handleSuccess)
  //     .catch(handleError);
  // }

</script>

<template>
  <div>
    Share Screen
    <button @click="startCapturing">
      Start Capturing
    </button>
    <button @click="stopCapturing">
      Stop Capturing
    </button>
  </div>
</template>