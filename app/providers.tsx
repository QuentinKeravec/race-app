"use client";

import type {ThemeProviderProps} from "next-themes";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import * as React from "react";
import {HeroUIProvider} from "@heroui/system";
import {useRouter} from "next/navigation";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ToastProvider} from "@heroui/toast";
import { I18nProvider } from "@react-aria/i18n";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider navigate={router.push}>
          <NextThemesProvider {...themeProps}>
            <ToastProvider />
            <I18nProvider locale="ja-JP">
              {children}
            </I18nProvider>
          </NextThemesProvider>
        </HeroUIProvider>
      </QueryClientProvider>
  );
}
