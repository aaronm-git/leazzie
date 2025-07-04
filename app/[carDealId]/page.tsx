"use client";

import { useOffers } from "@/providers/offer-provider";
import { FileText } from "lucide-react";
import { EmptyTableState } from "@/components/empty-table-state";
import { DealsTable } from "@/components/offer-table";
import AddDealDialog from "@/components/add-deal-dialog";

export default function DealsPage() {
  const { offers, loading, error } = useOffers();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {/* <CarDealHeader /> */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="mb-1 flex items-center gap-2 text-3xl font-bold">
            <FileText className="h-7 w-7" />
            Active Offers
          </h1>
          <p className="text-muted-foreground">
            All lease offers for this car.
          </p>
        </div>

        <AddDealDialog />
      </div>
      {!offers || offers.length === 0 ? (
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
