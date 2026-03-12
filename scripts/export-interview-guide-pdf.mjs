import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const docsDir = path.join(repoRoot, "docs");

function resolveGuidePaths() {
  const preferredHtml = path.join(docsDir, "interview-guide.html");
  const legacyHtml = path.join(docsDir, "day-04-frontend-interview-guide.html");

  if (existsSync(preferredHtml)) {
    return {
      inputPath: preferredHtml,
      outputPath: path.join(docsDir, "interview-guide.pdf"),
    };
  }

  return {
    inputPath: legacyHtml,
    outputPath: path.join(docsDir, "day-04-frontend-interview-guide.pdf"),
  };
}

function getChromeCandidates() {
  if (process.platform === "win32") {
    return [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    ];
  }

  if (process.platform === "darwin") {
    return [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ];
  }

  return [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/microsoft-edge",
  ];
}

function findChromeExecutable() {
  const chromePath = getChromeCandidates().find((candidate) =>
    existsSync(candidate),
  );

  if (!chromePath) {
    throw new Error(
      "Could not find a local Chrome/Edge executable for PDF export.",
    );
  }

  return chromePath;
}

function runChrome(chromePath, userDataDir, inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const fileUrl = pathToFileURL(inputPath).href;
    const args = [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      `--user-data-dir=${userDataDir}`,
      `--print-to-pdf=${outputPath}`,
      fileUrl,
    ];

    const child = spawn(chromePath, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          stderr.trim() || `Chrome PDF export failed with exit code ${code}.`,
        ),
      );
    });
  });
}

async function main() {
  const chromePath = findChromeExecutable();
  const { inputPath, outputPath } = resolveGuidePaths();
  const legacyOutputPath = path.join(
    docsDir,
    "day-04-frontend-interview-guide.pdf",
  );

  await mkdir(docsDir, { recursive: true });

  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "interview-guide-"));
  const userDataDir = path.join(tempRoot, "chrome-profile");

  try {
    if (!existsSync(inputPath)) {
      throw new Error(`Guide source not found: ${inputPath}`);
    }

    await runChrome(chromePath, userDataDir, inputPath, outputPath);

    if (outputPath !== legacyOutputPath && existsSync(legacyOutputPath)) {
      await rm(legacyOutputPath, { force: true });
    }

    console.log(`Exported PDF: ${outputPath}`);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
