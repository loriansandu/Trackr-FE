import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'tracker-front-end',
  webDir: 'dist/tracker-front-end',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'always',
    },
};

export default config;
