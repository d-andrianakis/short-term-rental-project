'use server';

import { db } from "@/db/drizzle";
import { property } from "@/db/schema";
import { eq } from "drizzle-orm";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

// import RemoveOrder from "./removeOrder";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { revalidatePath } from "next/cache";

import RemovePropertyButton from "@/components/admin/removeProperty";

async function deleteProperty(id: number) {
  "use server";
  await db.delete(property).where(property.id.eq(id));
  revalidatePath("/properties");
}

export default async function OrdersTablesServer() {

    const response = await db.select().from(property);

    return (
        <div className="max-w-[1700px] mx-auto py-10">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>identifier</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
                </TableHeader>

                <TableBody>
                {response.map((item) => (
                    <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.identifier}</TableCell>
                    <TableCell>{item.slug}</TableCell>
                    <TableCell>
                        <RemovePropertyButton propertyId={item.id} />
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
    );
}