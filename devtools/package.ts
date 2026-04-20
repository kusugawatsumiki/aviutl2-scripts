import fs from "node:fs";
import { execSync } from "node:child_process";

const fromArgv = (key: string): string => {
  const arg = process.argv[2];
  if (!arg) throw new Error(`Argument ${key} is required`);

  const [argKey, argValue] = arg.split('=');
  if (argKey !== key) throw new Error(`Argument ${key} is required`);
  if (!argValue) throw new Error(`Argument ${key} must have a value`);

  return argValue;
};

const packageName = (version: string) => `kusugawatsumiki-aviutl2-scripts_v${version}`;
const packageExtension = "au2pkg.zip";

const createArchiveStructure = (version: string): string => {
  try {
    fs.mkdirSync("dist");
  } catch (error) {
    // do nothing
  }

  const root = `dist/${packageName(version)}`;
  try {
    fs.mkdirSync(root);
    fs.mkdirSync(`${root}/Script`);

    fs.copyFileSync("assets/package.ini", `${root}/package.ini`);
    fs.copyFileSync("assets/package.txt", `${root}/package.txt`);

    const scripts = fs.readdirSync("scripts");
    for (const script of scripts) {
      fs.copyFileSync(`scripts/${script}`, `${root}/Script/${script}`);
    }
  } catch (error) {
    console.error("Error occurred while creating archive structure:", error);
    throw error;
  }

  return root;
};

const cleanArchiveStructure = (path: string) => {
  try {
    fs.rmSync(path, { recursive: true, force: true });
  } catch (error) {
    console.error("Error occurred while cleaning archive structure:", error);
    throw error;
  }
};

const compressPackage = (path: string, destination: string): string => {
  const command = `Compress-Archive -Path "${path}\\*" -DestinationPath "${destination}" -Force`;
  try {
    execSync(command, { shell: "powershell", stdio: "inherit" });
    return destination;
  } catch (error) {
    console.error("Error occurred while compressing package:", error);
    throw error;
  }
};

const version = fromArgv("--version");
const archivePath = createArchiveStructure(version);
const packagePath = compressPackage(archivePath, `${archivePath}.${packageExtension}`);
cleanArchiveStructure(archivePath);

console.log(`✓ Package created successfully: ${packagePath}`);