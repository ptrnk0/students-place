import { initMongoDB } from "./db/initMongoDB.js";
import { startServer } from "./server.js";

async function bootstrap() {
  await initMongoDB();
  startServer();
}

bootstrap();
