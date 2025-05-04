import { router } from './create-context';
import { hiProcedure } from './routes/example/hi/route';
import { postRouter } from './routes/posts/route';
import { userRouter } from './routes/users/route';
import { challengeRouter } from './routes/challenges/route';
import { matchRouter } from './routes/matches/route';
import { messageRouter } from './routes/messages/route';

export const appRouter = router({
  example: router({
    hi: hiProcedure,
  }),
  posts: postRouter,
  users: userRouter,
  challenges: challengeRouter,
  matches: matchRouter,
  messages: messageRouter,
});

export type AppRouter = typeof appRouter;