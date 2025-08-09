"use client";

import { useState, FormEvent } from "react";

export default function AddPropertyPage() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    status: false,
    identifier: "",
    value: "",
    expiresAt: "",
  });

  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const res = await fetch("/admin/properties/add/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage("Property added successfully!");
      setFormData({
        id: "",
        name: "",
        slug: "",
        status: false,
        identifier: "",
        value: "",
        expiresAt: "",
      });
    } else {
      setMessage("Failed to add property.");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          type="text"
          placeholder="ID"
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="border p-2 w-full"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
          />
          Active?
        </label>
        <input
          type="text"
          placeholder="Identifier"
          value={formData.identifier}
          onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Value"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          required
          className="border p-2 w-full"
        />
        <input
          type="datetime-local"
          value={formData.expiresAt}
          onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
          required
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Property
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
