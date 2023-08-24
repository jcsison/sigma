import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import createSpeechServicesPolyfill from 'web-speech-cognitive-services';
import { useCallback, useState } from 'react';

import { env } from '~/env.mjs';
import { Log } from '@root/lib/helpers';

const { SpeechRecognition: AzureSpeechRecognition } =
  createSpeechServicesPolyfill({
    credentials: {
      region: env.NEXT_PUBLIC_AZURE_SPEECH_REGION,
      subscriptionKey: env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
    },
  });

SpeechRecognition.applyPolyfill(AzureSpeechRecognition);

export const useListen = () => {
  const {
    browserSupportsSpeechRecognition,
    finalTranscript,
    isMicrophoneAvailable,
    resetTranscript,
    transcript,
  } = useSpeechRecognition();

  const [activeListen, setActiveListen] = useState(false);

  const isListenAvailable =
    browserSupportsSpeechRecognition && isMicrophoneAvailable;

  const startListening = (start?: boolean) => {
    if (start ?? activeListen) {
      SpeechRecognition.startListening({
        language: 'en-US',
      }).catch(Log.error);
    }
  };

  const stopListening = useCallback(() => {
    SpeechRecognition.abortListening().catch(Log.error);
    resetTranscript();
  }, [resetTranscript]);

  const startActiveListen = () => {
    setActiveListen(true);
    startListening(true);
  };

  const stopActiveListen = () => {
    setActiveListen(false);
    stopListening();
  };

  return {
    activeListen,
    finalTranscript,
    isListenAvailable,
    resetTranscript,
    startActiveListen,
    startListening,
    stopActiveListen,
    stopListening,
    transcript,
  } as const;
};
