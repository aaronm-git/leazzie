"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { AddCarDealDialog } from "@/components/add-car-deal-dialog";
import { Database } from "@/database.types";

export function CarDealsGrid({
  initialCarDeals,
}: {
  initialCarDeals: Database["public"]["Tables"]["car_deals"]["Row"][];
}) {
  const [carDeals, setCarDeals] =
    useState<Database["public"]["Tables"]["car_deals"]["Row"][]>(
      initialCarDeals
    );

  const handleCarDealAdded = (
    newCarDeal: Database["public"]["Tables"]["car_deals"]["Row"]
  ) => {
    setCarDeals((prev) => [newCarDeal, ...prev]);
  };

  if (carDeals.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="text-foreground mb-4">
          <Plus className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No car deals yet!
        </h3>
        <p className="text-muted-foreground mb-4">
          Get started by creating your first car deal to track lease offers.
        </p>
        <AddCarDealDialog onCarDealAdded={handleCarDealAdded}>
          <Button>Create Your First Car Deal</Button>
        </AddCarDealDialog>
      </div>
    );
  }

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Car Deals</h1>
          <p className="text-muted-foreground mt-1">
            Track and compare lease deals across multiple vehicles
          </p>
        </div>
        <AddCarDealDialog onCarDealAdded={handleCarDealAdded}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Car Deal
          </Button>
        </AddCarDealDialog>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {carDeals.map((deal) => (
          <Link href={`/${deal.id}/`} key={deal.id}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer pt-0 overflow-hidden border-2 border-primary/20 hover:border-primary/50">
              <CardHeader className="p-0">
                <img
                  src={
                    deal.image_url ||
                    "https://placehold.co/600x400?text=Car Deal"
                  }
                  alt={deal.title}
                  className="w-full h-40 object-cover object-center"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg">{deal.title}</CardTitle>
                <CardDescription>{deal.description}</CardDescription>
                <p className="text-sm text-gray-500">
                  {new Date(deal.created_at || "").toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}

        <AddCarDealDialog onCarDealAdded={handleCarDealAdded}>
          <Card className="h-full shadow-none cursor-pointer border-2 p-0 bg-transparent border-primary/20 border-dashed transition-all duration-300 group">
            <CardContent className="flex flex-row items-center justify-center h-full gap-2">
              <Plus className="h-12 w-12 text-gray-400 group-hover:text-primary transition-all duration-300" />
              <p className="text-xl font-bold text-gray-400 group-hover:text-primary transition-all duration-300">
                Add New Car Deal
              </p>
            </CardContent>
          </Card>
        </AddCarDealDialog>
      </div>
    </div>
  );
}
