"use client";

import { DealsTable } from "./deals-table";
import { EmptyDealsState } from "./empty-deals-state";
import { useCarDeal } from "@/providers/car-deal-provider";

export function CarDealContent() {
  const { deals } = useCarDeal();

  if (!deals || deals.length === 0) {
    return <EmptyDealsState />;
  }

  return <DealsTable />;
}
