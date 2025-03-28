import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from "./constants/index.js";
import { initMongoDB } from "./db/initMongoDB.js";
import { startServer } from "./server.js";
import { createDirIfNotExists } from "./utils/createDirIfNotExists.js";

async function bootstrap() {
  await initMongoDB();
  await createDirIfNotExists(UPLOAD_DIR);
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  startServer();
}

bootstrap();
