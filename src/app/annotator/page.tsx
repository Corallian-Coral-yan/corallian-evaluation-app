"use client";

import { useSession, signOut } from "next-auth/react";
import AnnotatorCanvas from "@/components/AnnotatorCanvas"; // Adjust if needed
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AnnotatorPage() {
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   // if (status === "unauthenticated") {
  //   //   router.push("/login");
  //   // }
  // }, [status, router]);

  // if (status === "loading") return <p>Loading...</p>;
  // if (!session) return null;

  return (
    <main className="p-6">
      <AnnotatorCanvas />
    </main>
  );
}
