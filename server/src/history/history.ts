import type { TextGenerationHistory } from 'root/lib/types';
import { Log } from 'root/lib/helpers';
import { summarizeHistory } from './summarizeHistory';

export class History {
  private history: TextGenerationHistory | undefined;

  constructor() {
    this.history = undefined;
  }

  get data() {
    return this.history;
  }

  resetHistory = () => {
    Log.info('- History Reset -');
    this.history = undefined;
  };

  updateHistory = async (newHistory: TextGenerationHistory) => {
    if (
      this.history &&
      this.history.internal
        .map((messages) => messages[1]?.slice(0, 30))
        .includes(
          newHistory.internal[newHistory.internal.length - 1]?.[1]?.slice(
            0,
            30,
          ) ?? '/|/|/|',
        )
    ) {
      Log.info(
        JSON.stringify([
          newHistory.internal[newHistory.internal.length - 1]?.[1]?.slice(
            0,
            30,
          ),
        ]),
      );
      Log.info(
        JSON.stringify(
          this.history.internal.map((messages) => messages[1]?.slice(0, 30)),
        ),
      );
      this.resetHistory();
      return;
    }

    if (newHistory.visible.length >= 10) {
      const summary = await summarizeHistory(newHistory);
      this.history = {
        internal: [['', summary ?? ''], ...newHistory.internal.slice(-5)],
        visible: [['', summary ?? ''], ...newHistory.visible.slice(-5)],
      };
      return;
    }

    this.history = newHistory;
  };
}
