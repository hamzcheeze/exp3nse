"use client";

import TableData from "@/components/data-table";
import { Button } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { data: session } = useSession();

  return (
    <div>
      <div className="flex justify-between items-center px-4 mb-4">
        <h1 className="text-4xl font-bold">Data</h1>
        <Button
        >
          Add
        </Button>
      </div>
      <TableData />
    </div>
  );
}
