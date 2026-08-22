import { createAuthClient } from '@neondatabase/auth';
import { BetterAuthVanillaAdapter } from '@neondatabase/auth/vanilla';
import { createAuthClient as createReactClient } from 'better-auth/react';

const neonAuthURL = import.meta.env.VITE_NEON_AUTH_URL;

// Vanilla auth client for signIn/signUp/signOut methods
export const auth = createAuthClient(neonAuthURL, {
  adapter: BetterAuthVanillaAdapter(),
});

// React auth client for hooks like useSession
export const reactAuth = createReactClient({
  baseURL: neonAuthURL,
});
