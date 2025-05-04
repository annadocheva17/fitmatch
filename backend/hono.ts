import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './trpc/app-router';
import { createContext } from './trpc/create-context';
import { cors } from 'hono/cors';

const app = new Hono();

// Enable CORS for all routes
app.use('/*', cors({
  origin: '*', // Allow all origins in development
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

// Add tRPC to Hono
app.use('/trpc/*', trpcServer({
  router: appRouter,
  createContext,
}));

// Add a simple health check endpoint
app.get('/', (c) => {
  return c.json({
    status: 'ok',
    message: 'FitMatch API is running',
  });
});

export default app;