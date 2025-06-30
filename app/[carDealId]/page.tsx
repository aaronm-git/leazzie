"use client";

import { useCarDeal } from "@/providers/car-deal-provider";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EmptyDealsState } from "@/components/empty-deals-state";
import { DealsTable } from "@/components/deals-table";

export default function DealsPage() {
  const { carDeal, deals } = useCarDeal();

  return (
    <>
      {/* <CarDealHeader /> */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Running Deals</h1>
          <p className="text-muted-foreground">
            All lease deals for {carDeal.title}
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Deal
        </Button>
      </div>
      {!deals || deals.length === 0 ? <EmptyDealsState /> : <DealsTable />}
    </>
  );
}
