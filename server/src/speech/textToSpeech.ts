import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import player from 'play-sound';

import { env } from '~/env.mjs';

import { xmlToString } from './helper';

const audioPlayer = player({ player: 'mplayer' });

const speechPath = 'src/speech/';

export const textToSpeech = async (text: string) => {
  const speechKey = env.AZURE_SPEECH_KEY;
  const speechRegion = env.AZURE_SPEECH_REGION;

  if (!speechKey || !speechRegion) {
    throw new Error('Invalid speech config');
  }

  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(
    speechPath + 'output.wav',
  );
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    speechKey,
    speechRegion,
  );
  const speechSynthesizer = new sdk.SpeechSynthesizer(
    speechConfig,
    audioConfig,
  );

  const ssml = xmlToString(speechPath + 'ssml.xml').replace(
    'text_input',
    text.replace('<', '&lt;').replace('>', '&gt;'),
  );

  speechConfig.speechSynthesisVoiceName = 'en-US-AshleyNeural';

  await new Promise<sdk.SpeechSynthesisResult>((resolve, reject) => {
    speechSynthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        if (result.errorDetails) {
          reject(result.errorDetails);
        }

        speechSynthesizer.close();
        resolve(result);
      },
      (e) => {
        speechSynthesizer.close();
        reject(e);
      },
    );
  });

  await new Promise((resolve, reject) => {
    audioPlayer.play(
      speechPath + 'output.wav',
      { mplayer: ['-ao', 'pulse'] },
      (e) => {
        if (e) {
          reject(e);
        }

        resolve(undefined);
      },
    );
  });
};
