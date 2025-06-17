"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Dialog.Root open>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <Dialog.Title className="text-xl font-semibold mb-4 text-center">
              Sign in to Corallian Annotator
            </Dialog.Title>
            <Dialog.Description className="mb-6 text-center text-gray-600">
              Use your Google account to continue.
            </Dialog.Description>

            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Sign in with DLSU Google Account
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
