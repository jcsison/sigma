import SpeechRecognition from 'react-speech-recognition';
import axios from 'axios';
import {
  Fragment,
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { ChatData, TextGenerationResponseData } from '@root/lib/types';
import { Log } from '@root/lib/helpers';
import { env } from '~/env.mjs';
import { trpc } from '~/lib/api/trpc';
import { useListen } from '~/hooks/useListen';

const updateHistory = (
  prevHistory: string[][] | undefined,
  newHistory: string[][],
) => {
  if (!prevHistory) {
    return [newHistory[newHistory.length - 1] ?? []];
  }

  return [...prevHistory, [...(newHistory[newHistory.length - 1] ?? [])]];
};

const sendPrompt = async ({ userInput }: ChatData) => {
  const data = await axios.post<TextGenerationResponseData>(
    env.NEXT_PUBLIC_SERVER_API_URL + '/chat',
    { userInput },
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
  return data.data;
};

export const RecordComponent = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    activeListen,
    finalTranscript,
    isListenAvailable,
    resetTranscript,
    startActiveListen,
    startListening,
    stopActiveListen,
    stopListening,
    transcript,
  } = useListen();

  const [history, setHistory] = useState<string[][]>();
  const [speechInput, setSpeechInput] = useState<string>();
  const [textInput, setTextInput] = useState('');

  const {
    isError: sendPromptError,
    isLoading: sendPromptLoading,
    mutate: sendPromptMutate,
  } = trpc.chat.useMutation({
    mutationFn: sendPrompt,
    onSuccess: async (data) => {
      setSpeechInput(undefined);
      setHistory((prev) => updateHistory(prev, data.history));
      // await axios.post<ChatData>(env.NEXT_PUBLIC_SERVER_API_URL + "/speech", {
      //   userInput: data.response,
      // });
      await Promise.resolve<ChatData>({ userInput: data.response });
      startListening();
    },
  });

  const resetHistory = () => {
    setHistory(undefined);
  };

  const scrollToEnd = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleTextInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
  };

  const handleSendTextInput = () => {
    if (textInput) {
      sendPromptMutate({ userInput: textInput });
      setSpeechInput(textInput);
      setTextInput('');
    }
  };

  const handleTextInputEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendTextInput();
    }
  };

  // Scroll chat window to the bottom on every message
  useEffect(() => {
    scrollToEnd();
  }, [history, speechInput]);

  // Log transcripts to console
  useEffect(() => {
    if (transcript) {
      Log.info(transcript);
    }
  }, [transcript]);

  // Send prompt to API once done listening
  useEffect(() => {
    if (finalTranscript !== '' && !sendPromptLoading) {
      stopListening();
      sendPromptMutate({ userInput: finalTranscript });
      setSpeechInput(finalTranscript);
      resetTranscript();
      SpeechRecognition.stopListening().catch(Log.error);
    }
  }, [
    finalTranscript,
    resetTranscript,
    sendPromptLoading,
    sendPromptMutate,
    stopListening,
  ]);

  if (!isListenAvailable) {
    return null;
  }

  return (
    <main className="flex h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex h-screen flex-col items-center justify-center gap-8 px-8 py-12">
        <div
          className="flex w-full max-w-lg flex-1 flex-col justify-end overflow-y-auto rounded-xl bg-gray-100/40 px-6 py-6 shadow-md"
          ref={scrollRef}
        >
          <div className="max-h-full">
            {history?.map((chat, i) => (
              <Fragment key={i}>
                {chat[0] && (
                  <div className="w-full">
                    <div className="mb-4 inline-block max-w-sm rounded-xl bg-blue-900/60 px-2 pb-2 pt-1 shadow-sm">
                      <p className="text-1xl py-1 font-semibold text-white">
                        {chat[0]}
                      </p>
                    </div>
                  </div>
                )}

                {chat[1] && (
                  <div className="flex w-full justify-end">
                    <div className="mb-4 inline-block max-w-sm rounded-xl bg-sky-800/60 px-2 pb-2 pt-1 shadow-sm">
                      <p className="text-1xl inline-block py-1 font-semibold text-white">
                        {chat[1]}
                      </p>
                    </div>
                  </div>
                )}
              </Fragment>
            ))}

            {speechInput && (
              <div className="w-full">
                <div className="mb-4 inline-block max-w-sm rounded-xl bg-blue-900/60 px-2 pb-2 pt-1 shadow-sm">
                  <p className="text-1xl py-1 font-semibold text-white">
                    {speechInput}
                  </p>
                </div>
              </div>
            )}

            {speechInput && (
              <div className="flex w-full justify-end">
                <div className="mb-4 inline-block max-w-sm rounded-xl bg-sky-800/60 px-2 pb-2 pt-1 shadow-sm">
                  <p className="text-1xl inline-block py-1 font-semibold text-white">
                    {sendPromptError ? 'Error sending message!' : '...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button
            className={`flex max-w-xs flex-col gap-4 rounded-xl px-4 pb-2 pt-1 text-white shadow-lg ${
              activeListen
                ? 'bg-pink-600/80 hover:bg-pink-600/40'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            onClick={startActiveListen}
          >
            <h3 className="text-1xl font-semibold drop-shadow-sm">Start</h3>
          </button>

          <button
            className={`flex max-w-xs flex-col gap-4 rounded-xl px-4 pb-2 pt-1 text-white shadow-lg ${
              !activeListen
                ? 'bg-pink-600/80 hover:bg-pink-600/40'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            onClick={stopActiveListen}
          >
            <h3 className="text-1xl font-semibold drop-shadow-sm">Stop</h3>
          </button>

          <button
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 px-4 pb-2 pt-1 text-white shadow-lg hover:bg-white/20"
            onClick={resetHistory}
          >
            <h3 className="text-1xl font-semibold drop-shadow-sm">Reset</h3>
          </button>
        </div>

        <div className="flex">
          <input
            className="grow bg-white/50 px-2 text-sm font-semibold shadow-lg"
            onChange={handleTextInput}
            onKeyDown={handleTextInputEnter}
            value={textInput}
          />

          <button
            className="ml-4 max-w-xs bg-white/10 px-4 pb-2 pt-1 text-white shadow-lg hover:bg-white/20"
            onClick={handleSendTextInput}
          >
            <h3 className="text-1xl font-semibold text-white drop-shadow-sm">
              Send
            </h3>
          </button>
        </div>
      </div>
    </main>
  );
};

export default RecordComponent;
