"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ViolationRecord {
  id: string;
  photoUrl: string;
  isValidPermit: boolean;
  reason?: string;
}

const DUMMY_VIOLATIONS: ViolationRecord[] = [
  {
    id: "1",
    photoUrl: "https://picsum.photos/200/300",
    isValidPermit: false,
    reason: "Permit expired",
  },
  {
    id: "2",
    photoUrl: "https://picsum.photos/200/300",
    isValidPermit: false,
    reason: "No permit displayed",
  },
];

const AdminPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Admin Dashboard</h1>
      <Table>
        <TableCaption>A list of handicap parking violations.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Photo</TableHead>
            <TableHead>Valid Permit</TableHead>
            <TableHead>Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DUMMY_VIOLATIONS.map((violation) => (
            <TableRow key={violation.id}>
              <TableCell className="font-medium">{violation.id}</TableCell>
              <TableCell>
                <img
                  src={violation.photoUrl}
                  alt={`Violation ${violation.id}`}
                  className="w-24 h-24 object-cover rounded"
                />
              </TableCell>
              <TableCell>{violation.isValidPermit ? "Yes" : "No"}</TableCell>
              <TableCell>{violation.reason || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminPage;
