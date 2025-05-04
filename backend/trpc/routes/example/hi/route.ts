import { protectedProcedure } from '../../../create-context';

export const hiProcedure = protectedProcedure.query(() => {
  return {
    greeting: 'Hello from tRPC!',
    timestamp: new Date().toISOString(),
  };
});