'use client';

import React from 'react';
import { PrivyProvider as PrivyReactProvider } from '@privy-io/react-auth';

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'YOUR_PRIVY_APP_ID';

export default function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyReactProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#a3e635',
          logo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=decensat',
        },
        loginMethods: ['email', 'sms', 'wallet', 'google'],
      }}
    >
      {children}
    </PrivyReactProvider>
  );
}
