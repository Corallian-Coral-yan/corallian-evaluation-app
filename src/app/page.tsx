// src/app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useSession, signIn, signOut } from "next-auth/react";

// Dynamically import AnnotatorCanvas with SSR disabled (important for react-konva)
const AnnotatorCanvas = dynamic(() => import("../components/AnnotatorCanvas"), {
  ssr: false,
});

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Coral Annotator</h1>
      {session ? (
        <>
          <p className="mb-2">Welcome, {session.user?.name}!</p>
          <button className="mb-4 bg-red-500 text-white px-4 py-2 rounded" onClick={() => signOut()}>
            Sign out
          </button>
          <AnnotatorCanvas />
        </>
      ) : (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => signIn("google")}>
          Sign in with Google
        </button>
      )}
    </main>
  );
}
