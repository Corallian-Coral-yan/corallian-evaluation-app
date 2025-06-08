"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <h1
        onClick={() => router.push("/dashboard")}
        className="text-2xl font-bold cursor-pointer hover:text-blue-600 transition-colors duration-200"
      >
        Corallian Dashboard
      </h1>

      <div className="flex items-center space-x-4">
        {/* Evaluation button */}
        <button
          onClick={() => router.push("/evaluation")}
          className="px-4 py-2 rounded cursor-pointer hover:text-blue-600 transition-colors duration-200"
        >
          Evaluation
        </button>

        {/* User dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            className="inline-flex items-center rounded-full bg-blue-600 text-white px-4 py-2 cursor-pointer hover:bg-blue-700 transition"
            aria-label="User menu"
          >
            {session?.user?.name ?? "User"}
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white rounded-md shadow-md p-2 w-40"
              sideOffset={5}
            >
              <DropdownMenu.Item
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-4 py-2 text-sm cursor-pointer rounded hover:bg-red-600 hover:text-white"
              >
                Sign Out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
