import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import dotenv from 'dotenv';
import indexRoutes from './routes/index';

// Load environment variables from .env file
dotenv.config();

/**
 * The main Fastify server instance.
 * @type {FastifyInstance}
 */
const server = Fastify({
  logger: process.env.NODE_ENV === 'production'
    ? true // In production, use the default JSON logger.
    : {    // In development, use pino-pretty.
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      },
});

// Set Zod as the schema validator and serializer
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Register all application routes
server.register(indexRoutes);

/**
 * Starts the Fastify server.
 * Binds to the port specified in the PORT environment variable, or 5174 by default.
 */
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '5174', 10);
    await server.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];

for (const signal of signals) {
  process.on(signal, async () => {
    try {
      await server.close();
      console.log(`Server closed successfully due to ${signal} signal.`);
      process.exit(0);
    } catch (err) {
      console.error('Error during server shutdown:', err);
      process.exit(1);
    }
  });
}