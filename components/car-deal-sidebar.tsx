"use client";

import Link from "next/link";
import LeazzyLogo from "@/public/leazzy-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Building2, Users, FileText, FileCog } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CarDealSwitcher } from "./car-deal-switcher";
import { useCarDeal } from "@/providers/car-deal-provider";
import { Settings } from "lucide-react";
import { UpdateCarDealSheet } from "@/components/update-car-deal-sheet";

export function CarDealSidebar() {
  const { deals, dealerships, contacts, carDealId } = useCarDeal();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/">
          <div className="flex items-center justify-between h-20">
            <img
              src={LeazzyLogo.src}
              alt="Leazzy.com Logo"
              className="object-cover object-center w-48"
            />
          </div>
        </Link>
        <Separator />
        <SidebarMenu>
          <SidebarMenuItem>
            <CarDealSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/${carDealId}/deals`}>
                    <FileText className="h-4 w-4" />
                    <span>Deals</span>
                    <Badge variant="secondary" className="ml-auto">
                      {deals?.length || 0}
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/${carDealId}/dealerships`}>
                    <Building2 className="h-4 w-4" />
                    <span>Dealerships</span>
                    <Badge variant="secondary" className="ml-auto">
                      {dealerships?.length || 0}
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/${carDealId}/contacts`}>
                    <Users className="h-4 w-4" />
                    <span>Contacts</span>
                    <Badge variant="secondary" className="ml-auto">
                      {contacts?.length || 0}
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarSeparator />
              <SidebarMenuItem>
                <UpdateCarDealSheet>
                  <SidebarMenuButton>
                    <FileCog className="h-4 w-4" />
                    <span>Deal Settings</span>
                  </SidebarMenuButton>
                </UpdateCarDealSheet>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <span>← Back to All Deals</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
