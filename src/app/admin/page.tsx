"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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



const AdminPage: React.FC = () => {

  const clearViolations = () => {
      localStorage.removeItem("violations");
      setViolations([]);
    };

  const [violations, setViolations] = useState<ViolationRecord[]>([]); 

  useEffect(() => {
    // Retrieve violations from local storage
    const storedViolations = localStorage.getItem("violations");
    if (storedViolations) {
      setViolations(JSON.parse(storedViolations));
    } else {
      // If no violations are present, set it as empty array
      localStorage.setItem("violations", JSON.stringify([]))
      setViolations([]);
    }
  }, []);

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
          {violations.map((violation) => (
            <TableRow key={violation.id} >
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
      <div className="mt-4">
      <Button onClick={clearViolations}>Clear Violations</Button>
    </div>
    </div>
  );
};
export default AdminPage;
