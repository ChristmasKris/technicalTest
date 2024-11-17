"use client";

import localFont from "next/font/local";
import { ClerkProvider, useUser, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ConvexAuthWrapper>{children}</ConvexAuthWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}

// Helper component to handle useUser
function ConvexAuthWrapper({ children }: { children: React.ReactNode }) {
 	const { isSignedIn, user } = useUser();
	const userRole = user?.publicMetadata?.role;
	
   return (
    <>
      <header>
        {!isSignedIn ? (
          <SignInButton />
        ) : (
          <UserButton />
        )}
      </header>
      <main>
        {userRole === "teacher" && <div>Welcome, Teacher!</div>}
        {userRole === "student" && <div>Welcome, Student!</div>}
        {children}
      </main>
    </>
  );
}