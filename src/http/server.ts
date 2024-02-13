import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import { z } from 'zod'

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
})

const prisma = new PrismaClient()

app.post('/polls', async (request, reply) => {
  const createPollBody = z.object({
    title: z.string().min(3),
  })

  const { title } = createPollBody.parse(request.body)

  const poll = await prisma.poll.create({
    data: {
      title,
    },
  })

  return reply.code(201).send(poll.id)
})

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
  console.log('Server is running on port 3333')
})
