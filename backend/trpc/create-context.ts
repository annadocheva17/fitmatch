import { initTRPC, TRPCError } from '@trpc/server';
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Context {
  user: User | null;
}

export const createContext = async ({ req }: FetchCreateContextFnOptions): Promise<Context> => {
  // In a real app, you would verify the auth token here
  // For now, we'll just simulate a logged-in user
  const user = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  return { user };
};

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware to check if user is authenticated
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);