import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const srcIcon = path.resolve(__dirname, '../logo_icon.ico');
const destIcon1 = path.resolve(__dirname, 'public/favicon.ico');
const destIcon2 = path.resolve(__dirname, 'public/logo_icon.ico');
if (fs.existsSync(srcIcon)) {
  fs.copyFileSync(srcIcon, destIcon1);
  fs.copyFileSync(srcIcon, destIcon2);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
});

