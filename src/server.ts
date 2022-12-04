// Read the .env file.
import dotenvLoad from 'dotenv-load';
// Require the framework
import Fastify, { FastifyListenOptions } from 'fastify';
// Require library to exit fastify process, gracefully (if possible)
import closeWithGrace, { CloseWithGraceAsyncCallback } from 'close-with-grace';
import app from './app';

dotenvLoad();

const {
  FASTIFY_CLOSE_GRACE_DELAY,
  PORT,
  SOCK,
  HOST,
} = process.env;

// Instantiate Fastify with some config
const server = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
server.register(app);

// delay is the number of milliseconds for the graceful close to finish
const graceClose: CloseWithGraceAsyncCallback = async ({ err }) => {
  if (err) {
    server.log.error(err);
  }
  await server.close();
};
const closeListeners = closeWithGrace(
  {
    delay: parseInt(FASTIFY_CLOSE_GRACE_DELAY!, 10) || 500,
  },
  graceClose,
);

server.addHook('onClose', async (instance, done) => {
  closeListeners.uninstall();
  done();
});

// Start listening.
const listening: FastifyListenOptions = {};
if (SOCK) {
  listening.path = SOCK;
} else {
  listening.port = parseInt(PORT!, 10) || 3000;
  listening.host = HOST ?? '127.0.0.1';
}
server.listen(listening, (err: any) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
