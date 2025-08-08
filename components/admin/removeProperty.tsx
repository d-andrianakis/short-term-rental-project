"use client";

import { removeProperty } from "./actions/removeProperty";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export default function RemovePropertyButton({ propertyId, onRemoved }: { propertyId: string, onRemoved?: () => void }) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = async () => {
    startTransition(async () => {
      const result = await removeProperty(propertyId);
      if (result.success && onRemoved) {
        onRemoved();
      }
    });

    if (onRemoved) onRemoved();
  };

  return (
    <Button variant="destructive" onClick={handleRemove}>
      Remove
    </Button>
  );
}