<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  
  import { Messages } from './messages';
  import { sendMessageToBackground, sendMessageToContentScript } from './messenger';
  

  const capturing = ref(<boolean>false);
  const startCapturing = async():Promise<void> => {
    try {
      const tab = await getCurrentTab();
      const tabID = <number>tab.id;

      const response = await sendMessageToContentScript(
        tabID,
        Messages.SS_UI_REQUEST,
        {
          message: 'Initialise Screen Capture'
        }
      );
      console.log(`response: ${response}`);
      capturing.value = true;
    }
    catch (err) {
      console.error(`error: ${err}`);
    }
  }
  
  const stopCapturing = async():Promise<void> => {
    try {
      const tab = await getCurrentTab();
      const tabID = <number>tab.id;

        const response = await sendMessageToContentScript(
          tabID,
          Messages.SS_UI_CANCEL,
          {
            message: 'Stop Screen Capture'
          }
        );
        console.log(`response: ${response}`);
        capturing.value = false;
    }
    catch (err) {
      console.error(`error: ${err}`);
    }
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

  // // listen to messages from content-script
  // const capturing = ref(<boolean>false);
  // document.addEventListener('DOMContentLoaded', () => {
  //   window.addEventListener('message', (event) => {
  //     alert(`test`);
  //   });
  // });
</script>

<template>
  <div>
    <button 
      v-if="!capturing" 
      @click="startCapturing">
      Start Capturing
    </button>
    <button 
      v-else
      @click="stopCapturing">
      Stop Capturing
    </button>
    <p>
      Capturing: {{ capturing }}
    </p>
  </div>
</template>