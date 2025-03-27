import { TEMP_UPLOAD_DIR, TEMPLATES_DIR } from "./constants/index.js";
import { initMongoDB } from "./db/initMongoDB.js";
import { startServer } from "./server.js";
import { createDirIfNotExists } from "./utils/createDirIfNotExists.js";

async function bootstrap() {
  await initMongoDB();
  await createDirIfNotExists(TEMPLATES_DIR);
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  startServer();
}

bootstrap();
