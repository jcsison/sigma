import player from 'play-sound';
import sdk from 'microsoft-cognitiveservices-speech-sdk';
import { ChildProcess } from 'child_process';

import { Log, g } from '../utils/helpers/index.js';
import { xmlToString } from './helper.js';

const audioPlayer = player({ player: 'mplayer' });
let currentPlayer: ChildProcess | undefined;

const speechPath = 'src/lib/speech/';

export const textToSpeech = async (text: string) => {
  currentPlayer?.kill();

  const speechKey = g.validate(process.env.AZURE_SPEECH_KEY, g.string);
  const speechRegion = g.validate(process.env.AZURE_SPEECH_REGION, g.string);

  if (!speechKey || !speechRegion) {
    throw new Error('Invalid speech config');
  }

  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(
    speechPath + 'output.wav'
  );
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    speechKey,
    speechRegion
  );
  const speechSynthesizer = new sdk.SpeechSynthesizer(
    speechConfig,
    audioConfig
  );

  const ssml = xmlToString(speechPath + 'ssml.xml').replace(
    'text_input',
    text.replace('<', '&lt;').replace('>', '&gt;')
  );

  speechConfig.speechSynthesisVoiceName = 'en-US-AshleyNeural';

  await new Promise<sdk.SpeechSynthesisResult>((resolve, reject) => {
    speechSynthesizer.speakSsmlAsync(
      ssml,
      result => {
        if (result.errorDetails) {
          reject(result.errorDetails);
        }

        speechSynthesizer.close();
        resolve(result);
      },
      e => {
        speechSynthesizer.close();
        reject(e);
      }
    );
  });

  currentPlayer = audioPlayer.play(
    speechPath + 'output.wav',
    { mplayer: ['-ao', 'pulse'] },
    e => {
      if (e) {
        Log.error(e);
      }
    }
  );
};
