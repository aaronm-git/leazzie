"use client";

import { useCarDeal } from "@/providers/car-deal-provider";
import { FileText } from "lucide-react";
import { EmptyTableState } from "@/components/empty-table-state";
import { DealsTable } from "@/components/deals-table";
import AddDealDialog from "@/components/add-deal-dialog";

export default function DealsPage() {
  const { carDeal, deals } = useCarDeal();

  return (
    <>
      {/* <CarDealHeader /> */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <FileText className="h-7 w-7" />
            Running Deals
          </h1>
          <p className="text-muted-foreground">
            All lease deals for {carDeal.title}
          </p>
        </div>

        <AddDealDialog />
      </div>
      {!deals || deals.length === 0 ? (
        <EmptyTableState
          addDealDialog={<AddDealDialog />}
          title="No deals yet"
          description="Start tracking lease deals for this car by adding your first offer."
        />
      ) : (
        <DealsTable />
      )}
    </>
  );
}
