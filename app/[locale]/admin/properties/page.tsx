"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RemovePropertyButton from "@/components/admin/removePropertyButton";

export default function PropertiesTableClient() {
  const [properties, setProperties] = useState([]);

  async function fetchData() {
    const res = await fetch("/api/properties");
    const data = await res.json();
    setProperties(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh data after property removal
  const handleRemoved = () => {
    fetchData();
  };

  return (
    <div className="max-w-[1700px] mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Identifier</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.identifier}</TableCell>
              <TableCell>{item.slug}</TableCell>
              <TableCell>
                <RemovePropertyButton propertyId={item.id} onRemoved={handleRemoved} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
