"use client";

import { useCarDeal } from "@/providers/car-deal-provider";
import { EmptyTableState } from "@/components/empty-table-state";
import { DealershipsTable } from "@/components/dealership-table";
import AddDealershipDialog from "@/components/add-dealership-dialog";
import { Building2 } from "lucide-react";

export default function DealershipsPage() {
  const { carDeal, dealerships } = useCarDeal();

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <Building2 className="h-7 w-7" />
            Dealerships
          </h1>
          <p className="text-muted-foreground">
            All dealerships for {carDeal.title}
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
        <DealershipsTable />
      )}
    </>
  );
}
