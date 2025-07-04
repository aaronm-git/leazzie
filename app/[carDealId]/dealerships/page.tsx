"use client";

import { useEffect, useState } from "react";
import { EmptyTableState } from "@/components/empty-table-state";
import { DealershipsTable } from "@/components/dealership-table";
import AddDealershipDialog from "@/components/add-dealership-dialog";
import { Building2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/database.types";

export default function DealershipsPage() {
  const [dealerships, setDealerships] = useState<Tables<"dealerships">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchDealerships = async () => {
      try {
        const { data, error } = await supabase
          .from("dealerships")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setDealerships(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch dealerships",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDealerships();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="mb-1 flex items-center gap-2 text-3xl font-bold">
            <Building2 className="h-7 w-7" />
            Dealerships
          </h1>
          <p className="text-muted-foreground">
            All dealerships for this car deal
          </p>
        </div>

        <AddDealershipDialog />
      </div>
      {!dealerships || dealerships.length === 0 ? (
        <EmptyTableState
          addDealDialog={<AddDealershipDialog />}
          title="No dealerships yet"
          description="Start tracking lease deals for this car by adding your first dealership."
        />
      ) : (
        <DealershipsTable dealerships={dealerships} />
      )}
    </>
  );
}
