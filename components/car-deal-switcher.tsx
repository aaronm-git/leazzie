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
import { useCarDeal } from "@/providers/car-deal-provider";

export function CarDealSwitcher() {
  const { carDeal, allCarDeals, deals } = useCarDeal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="border">
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          title={carDeal.title}
        >
          {carDeal.image_url ? (
            <img
              src={carDeal.image_url}
              alt={carDeal.title}
              className="w-8 h-8 object-cover rounded-md border"
            />
          ) : (
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg">
              <Car className="size-5" />
            </div>
          )}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{carDeal.title}</span>
            <span className="truncate text-xs">{deals?.length || 0} deals</span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="right"
        sideOffset={4}
        className="max-w-sm"
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Car Deal Dashboards
        </DropdownMenuLabel>
        {allCarDeals?.map((deal) => (
          <DropdownMenuItem key={deal.id} asChild title={deal.title + " - " + deal.description}>
            <Link href={`/${deal.id}`} className="gap-2 p-2">
              {deal.image_url ? (
                <img
                  src={deal.image_url}
                  alt={deal.title}
                  className="w-8 h-8 object-cover rounded-md border"
                />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-md border">
                  <Car className="size-4 shrink-0" />
                </div>
              )}
              <div className="flex-1 text-left space-y-1 min-w-0">
                <div className="font-medium truncate">{deal.title}</div>
                {deal.description && (
                  <div className="text-xs text-muted-foreground truncate">
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
