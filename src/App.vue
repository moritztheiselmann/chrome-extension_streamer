<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  
  import { Messages } from './messages';
  import { sendMessageToBackground, sendMessageToContentScript } from './messenger';
  
  // const isCapturing = ref(<boolean>false);
  const startCapturing = async():Promise<void> => {
    try {
      const data =  { message: 'Initialise Screen Capture' };
      const response = await sendMessageToBackground(Messages.SS_UI_REQUEST, data);
      console.log(`response: ${response}`);
      setActive(true);
    }
    catch (err) {
      console.error(`error: ${err}`);
    }
  }
  
  const stopCapturing = async():Promise<void> => {
    try {
      const data =  { message: 'Stop Screen Capture' };
      const response = await sendMessageToBackground(Messages.SS_UI_CANCEL, data);
      console.log(`response: ${response}`);
      setActive(false);
    }
    catch (err) {
      console.error(`error: ${err}`);
    }
  }
  
  // const icons = ref({
  //   active: '',
  //   inactive: ''
  // });
  const active = ref(<boolean>false);
  const setActive = (value : boolean ) => {
    active.value = value;
    chrome.storage.sync.set({
      toggleCapturing: active
    }, () => {});

    // chrome.browserAction.setIcon({
    //   path: icons.value[active.value ? 'active' : 'inactive']
    // });
  }
  
  onMounted(() => {
      chrome.storage.sync.get(['toggleCapturing'], (result) => {
        active.value = result.toggleCapturing;
      })
  });


</script>

<template>
  <div>
    <button 
      v-if="!active" 
      @click="startCapturing">
      Start Capturing
    </button>
    <button 
      v-else
      @click="stopCapturing">
      Stop Capturing
    </button>
    <p>
      Capturing: {{ active }}
    </p>
  </div>
</template>