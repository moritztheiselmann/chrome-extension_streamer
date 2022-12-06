<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  
  import { Messages } from './messages';
  import { sendMessageToBackground, sendMessageToContentScript } from './messenger';
  
  const startCapturing = async():Promise<void> => {
    try {
      const response = await sendMessageToBackground(Messages.SS_UI_REQUEST, { message: 'Initialise Screen Capture' });
      console.log(`response: ${response}`);
      // if (response === 'accepted') {
      //   setActive(true);
      // }
      // else if (response === 'declined') {
      //   setActive(false);
      // }
    }
    catch (err) {
      console.error(`error: ${err}`);
    }
  }
  
  const stopCapturing = async():Promise<void> => {
    try {
      const response = await sendMessageToBackground(Messages.SS_UI_CANCEL, { message: 'Stop Screen Capture' });
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
    chrome.storage.local.set({ 'toggleCapturing': value })
    .then(() => {
      console.log(`toggleCapturing is set to + ${value}`);
    });

    // chrome.browserAction.setIcon({
    //   path: icons.value[active.value ? 'active' : 'inactive']
    // });
  }
  
  onMounted(() => {
      chrome.storage.local.get(['toggleCapturing'], (result) => {
        console.log(`got data from local storage: ${result.toggleCapturing}`);
        active.value = result.toggleCapturing;
      })
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
      if (changes.toggleCapturing) {
        active.value = changes.toggleCapturing.newValue;
        console.log(active.value);
      }
    }
  });

  // const toggleCapturing = () => {
  //   setActive(!active.value);
  // }

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
    <!-- <button @click="toggleCapturing"></button> -->
    <p>
      Capturing: {{ active }}
    </p>
  </div>
</template>