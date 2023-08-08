import { TextGenerationHistory } from '../types/chat.js';

export class History {
  private history: TextGenerationHistory | undefined;

  constructor() {
    this.history = undefined;
  }

  get data() {
    return this.history;
  }

  set data(newHistory) {
    if (newHistory && newHistory.visible.length > 4) {
      this.history = {
        internal: newHistory.internal.slice(-3),
        visible: newHistory.visible.slice(-3)
      };
      return;
    }

    this.history = newHistory;
  }
}
