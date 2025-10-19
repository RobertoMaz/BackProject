import { FastifyInstance } from 'fastify';
import healthRoutes from './health';

/**
 * Registers all routes for the application.
 * @param {FastifyInstance} server - The Fastify server instance.
 */
export default async function indexRoutes(server: FastifyInstance) {
  /**
   * @description Registers the health check endpoints.
   */
  server.register(healthRoutes);

  // TODO: Register other domain-specific routes here.
}
