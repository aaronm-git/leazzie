"use client";

import Link from "next/link";
import { Car, Plus, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useOffers } from "@/providers/offer-provider";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/database.types";
import Image from "next/image";

export function CarDealSwitcher() {
  const { offers } = useOffers();
  const params = useParams();
  const carDealId = params.carDealId as string;
  const supabase = createClient();

  const [carDeal, setCarDeal] = useState<Tables<"car_deals"> | null>(null);
  const [allCarDeals, setAllCarDeals] = useState<Tables<"car_deals">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarDeals = async () => {
      try {
        const [currentCarDealRes, allCarDealsRes] = await Promise.all([
          supabase.from("car_deals").select("*").eq("id", carDealId).single(),
          supabase
            .from("car_deals")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

        if (currentCarDealRes.data) {
          setCarDeal(currentCarDealRes.data);
        }

        if (allCarDealsRes.data) {
          setAllCarDeals(allCarDealsRes.data);
        }
      } catch (error) {
        console.error("Error fetching car deals:", error);
      } finally {
        setLoading(false);
      }
    };

    if (carDealId) {
      fetchCarDeals();
    }
  }, [carDealId, supabase]);

  if (loading || !carDeal) {
    return (
      <SidebarMenuButton size="lg" className="border" disabled>
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg">
          <Car className="size-5" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">Loading...</span>
        </div>
      </SidebarMenuButton>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="border">
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:text-sidebar-primary hover:bg-stone-200"
          title={carDeal.title}
        >
          {carDeal.image_url ? (
            <Image
              src={carDeal.image_url}
              alt={carDeal.title}
              className="h-8 w-8 rounded-md border object-cover"
              width={32}
              height={32}
            />
          ) : (
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg">
              <Car className="size-5" />
            </div>
          )}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{carDeal.title}</span>
            <span className="truncate text-xs">
              {offers?.length || 0} deals
            </span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        sideOffset={4}
        className="max-w-xs"
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Car Deal Dashboards
        </DropdownMenuLabel>
        {allCarDeals?.map((deal) => (
          <DropdownMenuItem
            key={deal.id}
            asChild
            title={deal.title + " - " + deal.description}
          >
            <Link href={`/${deal.id}`} className="gap-2 p-2">
              {deal.image_url ? (
                <Image
                  src={deal.image_url}
                  alt={deal.title}
                  className="h-8 w-8 rounded-md border object-cover"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-md border">
                  <Car className="size-4 shrink-0" />
                </div>
              )}
              <div className="min-w-0 flex-1 space-y-1 text-left">
                <div className="truncate font-medium">{deal.title}</div>
                {deal.description && (
                  <div className="text-muted-foreground truncate text-xs">
                    {deal.description}
                  </div>
                )}
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/" className="gap-2 p-2">
            <div className="flex size-8 items-center justify-center rounded-md border bg-transparent">
              <Plus className="size-4" />
            </div>
            <div className="text-muted-foreground font-medium">
              Create New Deal
            </div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
