import { Server } from "http";
import app from "./infrastructure/web/http.js";
import envConfig from "./config/env.config.js";
import socketApp from "./infrastructure/web/socket.js";
import mongoAdapter from "./shared/infrastructure/database/connection.js";

function bootstrap() {
  const server = new Server(app);

  const port = envConfig.port;
  socketApp(server);

  server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(async () => {
      console.log('Server closed');
      await mongoAdapter.close();
    });
  });

}

bootstrap();
