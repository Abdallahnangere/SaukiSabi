
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'process';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env vars regardless of the VITE_ prefix.
  // Fix: Explicitly import process to resolve the type error for cwd()
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env.AMIGO_BASE_URL': JSON.stringify(env.AMIGO_BASE_URL || 'https://amigo.ng/api'),
      'process.env.AMIGO_API_KEY': JSON.stringify(env.AMIGO_API_KEY),
      'process.env.FLUTTERWAVE_SECRET_KEY': JSON.stringify(env.FLUTTERWAVE_SECRET_KEY),
      'process.env.MY_BVN': JSON.stringify(env.MY_BVN),
    },
  };
});
