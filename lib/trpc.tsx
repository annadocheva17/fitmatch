import { createTRPCReact } from '@trpc/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { type AppRouter } from '@/backend/trpc/app-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Platform } from 'react-native';

// Create a React Query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Add better error handling and retry logic
      retry: 1,
      retryDelay: 500,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Create a tRPC React client
export const trpc = createTRPCReact<AppRouter>();

// Determine the base URL based on the environment
const getBaseUrl = () => {
  // For Expo, we need to handle different environments
  if (Platform.OS === 'web') {
    // For web, we can use relative URLs
    return '/api';
  }
  
  // For mobile in development, use the local IP or Expo development server
  // This is a fallback that will work in many Expo development scenarios
  // Use mock data instead of trying to connect to a real backend in development
  return 'http://localhost:8081/api';
};

// Create a tRPC client for non-React files
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
      // Add headers for potential auth tokens
      headers: () => {
        return {};
      },
      // Add custom fetch with timeout and better error handling
      fetch: async (url, options) => {
        try {
          // Create an AbortController to handle timeouts
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          console.error('Network request failed:', error);
          // Return a mock response for development
          if (__DEV__) {
            console.log('Using mock data due to network error');
            return new Response(JSON.stringify({ result: { data: {} } }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          throw error;
        }
      },
    }),
  ],
});

// Provider component for tRPC
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/trpc`,
          // Add headers for potential auth tokens
          headers: () => {
            return {};
          },
          // Add custom fetch with timeout and better error handling
          fetch: async (url, options) => {
            try {
              // Create an AbortController to handle timeouts
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
              
              const response = await fetch(url, {
                ...options,
                signal: controller.signal,
              });
              
              clearTimeout(timeoutId);
              return response;
            } catch (error) {
              console.error('Network request failed:', error);
              // Return a mock response for development
              if (__DEV__) {
                console.log('Using mock data due to network error');
                return new Response(JSON.stringify({ result: { data: {} } }), {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' },
                });
              }
              throw error;
            }
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}