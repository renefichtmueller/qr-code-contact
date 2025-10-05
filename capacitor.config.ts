import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.qrcodecontact',
  appName: 'qr-code-contact',
  webDir: 'dist',
  server: {
    url: 'https://963af7e2-4658-436e-9707-17b116a733d6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
