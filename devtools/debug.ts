import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import 'dotenv/config';

const updateScriptAll = async () => {
  const scripts = await fs.readdir("scripts");
  try {
    await Promise.all(scripts.map((script) => {
      return fs.copyFile(`scripts/${script}`, `${process.env.AVIUTL2_SCRIPTS_DIR}/${script}`);
    }));
  } catch(error) {
    console.error(error);
  }
};

const startAviUtl2 = async () => {
  return new Promise<void>((resolve, reject) => {
    if (!process.env.AVIUTL2_EXE_PATH) {
      reject("AVIUTL2_EXE_PATH is not defined in .env file");
      return;
    }

    const child = spawn(process.env.AVIUTL2_EXE_PATH, [], { detached: true, stdio: 'ignore' });
    child.on('error', (error) => {
      console.error('Failed to start AviUtl2:', error);
      reject(error);
    });
    child.on('spawn', () => {
      console.log('AviUtl2 started successfully.');
      resolve();
    });
  });
};

const main = async () => {
  try {
    await updateScriptAll();
    await startAviUtl2();
  } catch(error) {
    console.error(error);
  }
};

main().then(() => process.exit());