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
      {/* Main Content */}
      <main className="p-8 max-w-4xl mx-auto">
        <div className= "flex">
          <h2 className="text-xl mb-4 mr-1">
            Welcome,
          </h2>
          <h2 className="text-xl font-bold mb-4">
            {session.user?.name}!
          </h2>
        </div>
        <p className="text-gray-700 mb-6">
          This is your coral evaluation dashboard where you can view and manage
          evaluations and annotations.
        </p>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2">Recent Evaluations</h3>
          <p className="text-gray-600">You don't have any annotations yet.</p>
        </div>
      </main>
    </div>
  );
}
