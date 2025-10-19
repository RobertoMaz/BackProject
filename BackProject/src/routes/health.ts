import { FastifyInstance } from 'fastify';
import { withTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

/**
 * Encapsulates the health check route.
 * @param {FastifyInstance} server - The Fastify server instance.
 */
export default async function healthRoutes(server: FastifyInstance) {
  const fastify = server.withTypeProvider<z.ZodTypeProvider>();

  /**
   * @route GET /health
   * @description Responds with the server's health status.
   * @returns {object} A success message and the current timestamp.
   * // TODO: Enhance health check to include database connectivity, etc.
   */
  fastify.get(
    '/health',
    {
      schema: {
        description: 'Health check endpoint',
        tags: ['Health'],
        response: {
          200: z.object({
            status: z.string(),
            timestamp: z.string().datetime(),
          }),
        },
      },
    },
    async (request, reply) => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
      };
    }
  );
}
