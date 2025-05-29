import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";

export const metadata = {
  title: "Coral Annotator",
  description: "Annotate coral reef images using Konva and Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  if (typeof window !== "undefined") {
    console.log("CLIENT");
  } else {
    console.log("SERVER");
  }

  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
