import { createAuthClient } from '@neondatabase/auth';
import { BetterAuthReactAdapter } from '@neondatabase/auth/react';

const neonAuthURL = import.meta.env.VITE_NEON_AUTH_URL;

// Single unified auth client with React hooks (useSession, signIn, signUp, signOut)
export const auth = createAuthClient(neonAuthURL, {
  adapter: BetterAuthReactAdapter(),
});

export const reactAuth = auth;

