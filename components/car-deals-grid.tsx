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
import Image from "next/image";

export function CarDealsGrid({
  initialCarDeals,
}: {
  initialCarDeals: Database["public"]["Tables"]["car_deals"]["Row"][];
}) {
  const [carDeals, setCarDeals] =
    useState<Database["public"]["Tables"]["car_deals"]["Row"][]>(
      initialCarDeals,
    );

  const handleCarDealAdded = (
    newCarDeal: Database["public"]["Tables"]["car_deals"]["Row"],
  ) => {
    setCarDeals((prev) => [newCarDeal, ...prev]);
  };

  if (carDeals.length === 0) {
    return (
      <div className="col-span-full py-12 text-center">
        <div className="text-foreground mb-4">
          <Plus className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-foreground mb-2 text-lg font-medium">
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
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">My Car Deals</h1>
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
            <Card className="hover:border-primary/50 h-full cursor-pointer overflow-hidden border-2 border-gray-200 pt-0 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="p-0">
                <Image
                  src={
                    deal.image_url ||
                    "https://placehold.co/600x400?text=Car Deal"
                  }
                  alt={deal.title}
                  className="h-40 w-full object-cover object-center"
                  width={600}
                  height={400}
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
          <Card className="group h-full cursor-pointer border-2 border-dashed border-gray-200 bg-transparent p-0 shadow-none transition-all duration-300">
            <CardContent className="flex h-full flex-row items-center justify-center gap-2">
              <Plus className="group-hover:text-primary h-12 w-12 text-gray-400 transition-all duration-300" />
              <p className="group-hover:text-primary text-xl font-bold text-gray-400 transition-all duration-300">
                Add New Car Deal
              </p>
            </CardContent>
          </Card>
        </AddCarDealDialog>
      </div>
    </div>
  );
}
