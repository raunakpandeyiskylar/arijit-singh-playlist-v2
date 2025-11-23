
import { Server } from 'http';
import app from './infrastructure/web/http.js';
import connectDB from './shared/infrastructure/database/connection.js';
import envConfig from './config/env.config.js';
import socketApp from './infrastructure/web/socket.js';

function bootstrap() {
  const server = new Server(app);

  const port = envConfig.port;
  socketApp(server);

  server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });
}

bootstrap();
