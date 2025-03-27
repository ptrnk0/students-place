import fs from "node:fs/promises";

export async function createDirIfNotExists(url) {
  try {
    fs.access(url);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.mkdir(url);
    }
  }
}
