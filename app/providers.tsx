"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { ImageKitProvider } from "imagekitio-next";
const Provider = ({ children }: { children: React.ReactNode }) => {
  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit-auth");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Authentication failed. ", error);
      throw error;
    }
  };
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ImageKitProvider
          authenticator={authenticator}
          publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""}
          urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}
        >
          {children}
        </ImageKitProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default Provider;
