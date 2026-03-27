import "@/styles/globals.css";
import clsx from "clsx";

import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NavbarWrapper } from "@/components/navbar-wrapper";

export const viewport = { //
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
              )
            } catch {
              //
            }
          },
        },
      }
  )

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <NavbarWrapper user={user}>{children}</NavbarWrapper>
        </Providers>
      </body>
    </html>
  );
}
