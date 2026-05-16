import fs from 'node:fs';
import { spawn } from 'node:child_process';
import 'dotenv/config';

const updateScriptAll = (): void => {
  const scripts = fs.readdirSync("scripts");
  const copy = (script: string) => {
    try {
      fs.copyFileSync(`scripts/${script}`, `${process.env.AVIUTL2_SCRIPTS_DIR}/${script}`);
      return script;
    } catch(error) {
      console.error(`Error occurred while copying script ${script}:`, error);
    }
  };

  const result = scripts.map(script => copy(script));
  for (const script of result) {
    console.log(`✓ Updated: ${script}`);
  }
};

const startAviUtl2 = (): void => {
  if (!process.env.AVIUTL2_EXE_PATH) {
    throw new Error("AVIUTL2_EXE_PATH is not defined in .env file");
  }

  const child = spawn(process.env.AVIUTL2_EXE_PATH, [], { detached: true, stdio: 'ignore' });
  child.on('error', (error) => {
    console.error('Error occurred while starting AviUtl2:', error);
  });
  child.on('spawn', () => {
    console.log('✓ AviUtl2 started successfully.');
  });
};

try {
  updateScriptAll();
  startAviUtl2();
} catch(error) {
  console.error(error);
}

process.exit();