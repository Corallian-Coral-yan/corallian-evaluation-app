"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { signOut, useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-bold">Corallian Dashboard</h1>

        {/* User Dropdown Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="inline-flex items-center rounded-full bg-blue-600 text-white px-4 py-2 cursor-pointer hover:bg-blue-700 transition">
            {session.user?.name ?? "User"}
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
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Welcome, {session.user?.name}!
        </h2>
        <p className="text-gray-700 mb-6">
          This is your coral annotation dashboard where you can view and manage
          annotations.
        </p>

        {/* Example content card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Recent Annotations</h3>
          <p className="text-gray-600">You don't have any annotations yet.</p>
        </div>
      </main>
    </div>
  );
}
