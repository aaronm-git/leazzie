import { createClient } from "@/utils/supabase/client";
import LeazzyLogo from "@/public/leazzy-logo.png";
import { notFound } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Car,
  Building2,
  Users,
  FileText,
  Plus,
  DollarSign,
  Calendar,
  TrendingUp,
  MapPin,
  ChevronsUpDown,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export default async function DealsPage({
  params,
}: {
  params: Promise<{ carDealId: string }>;
}) {
  const { carDealId } = await params;
  const supabase = createClient();

  // Fetch car deal details
  const { data: carDeal } = await supabase
    .from("car_deals")
    .select("*")
    .eq("id", carDealId)
    .single();

  if (!carDeal) {
    notFound();
  }

  // Fetch all car deals for the switcher
  const { data: allCarDeals } = await supabase
    .from("car_deals")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch deals with dealership info
  const { data: deals } = await supabase
    .from("deals")
    .select(
      `
      *,
      dealerships ( name )
    `
    )
    .eq("car_deal_id", carDealId)
    .order("created_at", { ascending: false });

  // Fetch dealerships for this car deal
  const { data: dealerships } = await supabase
    .from("dealerships")
    .select("*")
    .eq("car_deal_id", carDealId);

  // Fetch contacts for this car deal (through dealerships)
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .in("dealership_id", dealerships?.map((d) => d.id) || []);

  return (
    <SidebarProvider>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    title={carDeal.title}
                  >
                    {carDeal.image_url ? (
                      <img
                        src={carDeal.image_url}
                        alt={carDeal.title}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                    ) : (
                      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg">
                        <Car className="size-5" />
                      </div>
                    )}
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {carDeal.title}
                      </span>
                      <span className="truncate text-xs">
                        {deals?.length || 0} deals
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side="right"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-muted-foreground text-xs">
                    Car Deals
                  </DropdownMenuLabel>
                  {allCarDeals?.map((deal) => (
                    <DropdownMenuItem key={deal.id} asChild>
                      <Link href={`/${deal.id}`} className="gap-2 p-2">
                        {deal.image_url ? (
                          <img
                            src={deal.image_url}
                            alt={deal.title}
                            className="w-8 h-8 object-cover rounded-md"
                          />
                        ) : (
                          <div className="flex size-8 items-center justify-center rounded-md border">
                            <Car className="size-4 shrink-0" />
                          </div>
                        )}
                        <div className="flex-1 text-left space-y-1">
                          <div className="font-medium">{deal.title}</div>
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
                      <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                        <Plus className="size-4" />
                      </div>
                      <div className="text-muted-foreground font-medium">
                        Create New Deal
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Manage</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
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
      <SidebarInset>
        <div className="p-6 ml-4">
          <div className="flex items-center justify-between mb-6">
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

          {!deals || deals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No deals yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start tracking lease deals for this car by adding your first
                  offer.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Deal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>All Deals ({deals.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Dealership</TableHead>
                      <TableHead>MSRP</TableHead>
                      <TableHead>Selling Price</TableHead>
                      <TableHead>Down Payment</TableHead>
                      <TableHead>Monthly Payment</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deals.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {deal.product_image_url && (
                              <img
                                src={deal.product_image_url}
                                alt={deal.product_title}
                                className="w-12 h-12 object-cover rounded-md"
                              />
                            )}
                            <div>
                              <div className="font-medium">
                                {deal.product_title}
                              </div>
                              {deal.product_specs && (
                                <div className="text-sm text-muted-foreground">
                                  {deal.product_specs}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {deal.dealerships?.name || "Unknown Dealership"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {deal.msrp ? (
                            <span className="font-mono">
                              ${deal.msrp.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {deal.selling_price ? (
                            <span className="font-mono">
                              ${deal.selling_price.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {deal.down_payment ? (
                            <span className="font-mono">
                              ${deal.down_payment.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">$0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {deal.selling_price && deal.lease_term ? (
                            <span className="font-mono">
                              $
                              {Math.round(
                                deal.selling_price / deal.lease_term
                              ).toLocaleString()}
                              /mo
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {deal.lease_term ? (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{deal.lease_term} months</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {deal.is_disqualified ? (
                            <Badge variant="destructive">Disqualified</Badge>
                          ) : (
                            <Badge variant="default">Active</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
