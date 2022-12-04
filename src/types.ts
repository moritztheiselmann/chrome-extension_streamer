import { Messages } from './messages';

export type Message<T> = {
  type: Messages;
  data: T; 
};

export type MessageListener = (
  sender: chrome.runtime.MessageSender,
  data: Message<any>
) => any;