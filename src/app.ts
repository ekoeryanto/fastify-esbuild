import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fastifyAutoload, AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';

// const __filename = url.fileURLToPath(import.meta.url);
const cwd = fileURLToPath(new URL('.', import.meta.url));

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
  forceESM: true,
};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(fastifyAutoload, {
    dir: join(cwd, 'plugins'),
    options: opts,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(fastifyAutoload, {
    dir: join(cwd, 'routes'),
    options: opts,
  });
};

export default app;
export { app, options };
