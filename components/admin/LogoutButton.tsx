"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui";

export default function AdminLogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-white/70 hover:text-white hover:bg-white/10"
    >
      Abmelden
    </Button>
  );
}

