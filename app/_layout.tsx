// app/_layout.tsx
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function RootLayout() {
  // QueryClient 
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* Mantém exatamente navegação/rotas */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="manage-employees" />
        <Stack.Screen name="rh" />
        <Stack.Screen name="checkin" />
        <Stack.Screen name="home" />
      </Stack>

    </QueryClientProvider>
  );
}
