"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function SignoutButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/"); // redirect to login page
            },
          },
        })
      }
    >
      Signout
    </Button>
  );
}