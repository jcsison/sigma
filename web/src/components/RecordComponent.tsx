import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import createSpeechServicesPolyfill from "web-speech-cognitive-services";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";

import { Log } from "~/lib/utils/helpers";
import { env } from "~/env.mjs";
import { type TextGenerationResponseData } from "~/lib/types/sigmaAPI.js";

const { SpeechRecognition: AzureSpeechRecognition } =
  createSpeechServicesPolyfill({
    credentials: {
      region: env.NEXT_PUBLIC_AZURE_SPEECH_REGION,
      subscriptionKey: env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
    },
  });

SpeechRecognition.applyPolyfill(AzureSpeechRecognition);

const sendPrompt = async (prompt: string) => {
  const data = await axios.post<TextGenerationResponseData>(
    env.NEXT_PUBLIC_SERVER_API_URL + "/chat",
    { userInput: prompt },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return data.data;
};

export const RecordComponent = () => {
  const {
    browserSupportsSpeechRecognition,
    finalTranscript,
    isMicrophoneAvailable,
    listening,
    resetTranscript,
    transcript,
  } = useSpeechRecognition();

  const [responseData, setResponseData] =
    useState<TextGenerationResponseData>();

  const { mutate: sendPromptMutate } = useMutation({
    mutationFn: sendPrompt,
    onSuccess: (data) => {
      setResponseData(data);
    },
  });

  Log.info(transcript);

  const startListening = () => {
    SpeechRecognition.startListening({
      language: "en-US",
    }).catch(Log.error);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening().catch(Log.error);
  };

  useEffect(() => {
    if (finalTranscript !== "") {
      sendPromptMutate(finalTranscript);
      resetTranscript();
      SpeechRecognition.stopListening().catch(Log.error);
    }
  }, [finalTranscript, resetTranscript, sendPromptMutate]);

  if (!browserSupportsSpeechRecognition || !isMicrophoneAvailable) {
    return null;
  }

  return (
    <main className="flex h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex h-screen flex-col items-center justify-center gap-8 px-4 py-12 ">
        <div className="mx-10 flex w-6/12 flex-1 flex-col justify-end overflow-y-auto rounded-xl bg-white/40 px-4 py-2 shadow-lg">
          {responseData?.history.map((h1) =>
            h1.map((h2, j) => {
              if (j % 2 === 0) {
                return (
                  <div className="w-full" key={j}>
                    <div className="my-2 inline-block max-w-sm rounded-xl bg-blue-900/80 px-2 py-2 shadow-lg">
                      <p className="text-1xl py-1 font-semibold text-white">
                        {h2}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="flex w-full justify-end" key={j}>
                  <div className="my-2 inline-block max-w-sm rounded-xl bg-sky-900/80 px-2 py-2 shadow-lg">
                    <p className="text-1xl py-1 font-semibold text-white">
                      {h2}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            className={`flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white shadow-lg hover:bg-white/20 ${
              listening ? "bg-pink-600/80" : ""
            }`}
            onClick={startListening}
          >
            <h3 className="text-2xl font-semibold drop-shadow-sm">Start</h3>
          </button>

          <button
            className={`flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white shadow-lg hover:bg-white/20 ${
              !listening ? "bg-pink-600/80" : ""
            }`}
            onClick={stopListening}
          >
            <h3 className="text-2xl font-semibold drop-shadow-sm">Stop</h3>
          </button>
        </div>
      </div>
    </main>
  );
};

export default RecordComponent;
