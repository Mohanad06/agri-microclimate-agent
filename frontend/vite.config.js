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

const cottonSrc = 'C:/Users/mahmo/.gemini/antigravity-ide/brain/2ed8318c-d305-42cb-8b36-e73986d34efa/media__1787870953612.png';
const cottonDest = path.resolve(__dirname, 'public/cotton.png');
if (fs.existsSync(cottonSrc)) {
  fs.copyFileSync(cottonSrc, cottonDest);
}

const grapeSrc = 'C:/Users/mahmo/.gemini/antigravity-ide/brain/2ed8318c-d305-42cb-8b36-e73986d34efa/media__1787871086246.png';
const grapeDest = path.resolve(__dirname, 'public/grape.png');
if (fs.existsSync(grapeSrc)) {
  fs.copyFileSync(grapeSrc, grapeDest);
}

const almondSrc = 'C:/Users/mahmo/.gemini/antigravity-ide/brain/2ed8318c-d305-42cb-8b36-e73986d34efa/media__1787871145319.png';
const almondDest = path.resolve(__dirname, 'public/almond.png');
if (fs.existsSync(almondSrc)) {
  fs.copyFileSync(almondSrc, almondDest);
}

const brushGreenSrc = 'C:/Users/mahmo/.gemini/antigravity-ide/brain/2ed8318c-d305-42cb-8b36-e73986d34efa/media__1787872202628.jpg';
const brushGreenDest = path.resolve(__dirname, 'public/brush_bottom_green.jpg');
if (fs.existsSync(brushGreenSrc)) {
  fs.copyFileSync(brushGreenSrc, brushGreenDest);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
});


