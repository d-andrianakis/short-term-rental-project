"use client";

import { Button } from "@/components/ui/button";

export default function RemovePropertyButton({ propertyId, onRemoved }: { propertyId: number; onRemoved?: () => void }) {
  async function handleRemove() {
    await fetch(`/api/properties/${propertyId}`, { method: "DELETE" });
    onRemoved?.();
  }

  return (
    <Button variant="destructive" onClick={handleRemove}>
      Remove
    </Button>
  );
}