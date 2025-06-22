"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // For hamburger icon (install lucide-react if needed)

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow relative">
      {/* Logo/Title */}
      <h1
        onClick={() => router.push("/dashboard")}
        className="text-2xl font-bold cursor-pointer hover:text-blue-600 transition-colors duration-200"
      >
        Corallian Dashboard
      </h1>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-4">
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

      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex items-center px-2 py-2"
        aria-label="Open menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <div className="absolute top-full right-0 w-48 mt-2 bg-white shadow-md rounded-md z-50 md:hidden">
          <button
            onClick={() => {
              router.push("/evaluation");
              setMenuOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-blue-50"
          >
            Evaluation
          </button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              className="flex items-center w-full px-4 py-2 rounded-full bg-blue-600 text-white mt-2 cursor-pointer hover:bg-blue-700 transition"
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
                  onClick={() => {
                    signOut({ callbackUrl: "/login" });
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2 text-sm cursor-pointer rounded hover:bg-red-600 hover:text-white"
                >
                  Sign Out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      )}
    </header>
  );
}
