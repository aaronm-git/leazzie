"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCarDeal } from "@/providers/car-deal-provider";

export function CarDealHeader() {
  const { carDeal } = useCarDeal();

  return (
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
  );
}
