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
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Building2, Users, FileText, FileCog } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CarDealSwitcher } from "./car-deal-switcher";
import { UpdateCarDealSheet } from "@/components/update-car-deal-sheet";

import { usePathname, useParams } from "next/navigation";
import Image from "next/image";

type SidebarMenuItem = {
  label?: string;
  href?: string;
  icon?: React.ReactNode;
  type: "link" | "button" | "separator";
};

export function CarDealSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const carDealId = params.carDealId as string;

  const sideBarMenuItems: SidebarMenuItem[] = [
    {
      label: "Offers",
      href: `/${carDealId}`,
      icon: <FileText className="h-4 w-4" />,
      type: "link",
    },
    {
      label: "Dealerships",
      href: `/${carDealId}/dealerships`,
      icon: <Building2 className="h-4 w-4" />,
      type: "link",
    },
    {
      label: "Contacts",
      href: `/${carDealId}/contacts`,
      icon: <Users className="h-4 w-4" />,
      type: "link",
    },
    {
      type: "separator",
    },
    {
      label: "Deal Settings",
      href: `/${carDealId}/settings`,
      icon: <FileCog className="h-4 w-4" />,
      type: "button",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/">
          <div className="flex h-20 items-center justify-between">
            <Image
              src={LeazzyLogo.src}
              alt="Leazzy.com Logo"
              className="w-48 object-cover object-center"
              width={192}
              height={192}
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
              {sideBarMenuItems.map((item, index) => {
                if (item.type === "separator") {
                  return <SidebarSeparator key={index} />;
                }

                if (item.type === "button") {
                  return (
                    <SidebarMenuItem key={item.label}>
                      <UpdateCarDealSheet>
                        <SidebarMenuButton
                          isActive={item.href === pathname}
                          className="hover:not-[.active]:bg-stone-200"
                        >
                          <FileCog className="h-4 w-4" />
                          <span>Car Deal Settings</span>
                        </SidebarMenuButton>
                      </UpdateCarDealSheet>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.href === pathname}
                      className="hover:not-[data-active=true]:bg-stone-200"
                    >
                      <Link href={item.href || `/${carDealId}`}>
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
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
