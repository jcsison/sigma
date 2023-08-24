declare module 'web-speech-cognitive-services' {
  interface Credentials {
    region: string;
    subscriptionKey: string;
  }

  interface SpeechServicesPolyfillProps {
    credentials: Credentials;
  }

  type SpeechRecognition = { SpeechRecognition: unknown };

  export default function createSpeechServicesPolyfill(
    speechServicesPolyfillProps: SpeechServicesPolyfillProps,
  ): SpeechRecognition;
}
