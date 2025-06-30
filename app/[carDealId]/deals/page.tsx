import { createClient } from "@/utils/supabase/client";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// The DealTable and AddDealDialog components would need to be adapted to use Server Actions
// import { DealTable } from '@/components/deal-tracker/deal-table'
// import { AddDealDialog } from '@/components/deal-tracker/add-deal-dialog'

export default async function DealsPage({
  params,
}: {
  params: { carDealId: string };
}) {
  const supabase = await createClient();
  const { data: deals } = await supabase
    .from("deals")
    .select(
      `
      *,
      dealerships ( name )
    `
    )
    .eq("car_deal_id", params.carDealId)
    .order("created_at", { ascending: false });

  if (!deals) {
    notFound();
  }

  // This is a simplified representation. You'd map the fetched `deals`
  // to the `FullDeal` structure your components expect.
  const formattedDeals = deals.map((d) => ({
    id: d.id,
    dealer: {
      id: d.dealership_id,
      name: d.dealerships?.name || "N/A",
      contact: {},
    },
    product: {
      title: d.product_title,
      link: d.product_link,
      imageUrl: d.product_image_url,
      specs: d.product_specs,
    },
    deal: {
      msrp: d.msrp,
      sellingPrice: d.selling_price,
      // ... map all other deal fields
    },
    monthlyPayment: 0, // This would be calculated
    isDisqualified: d.is_disqualified,
  }));

  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Deal Tracker</h1>
        {/* <AddDealDialog carDealId={params.carDealId} /> */}
        <p>Add Deal Button Here</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Deal Comparison</CardTitle>
          <CardDescription>
            A summary of all your logged lease deals for this car.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <DealTable deals={formattedDeals} /> */}
          <p>Deal Table Here</p>
        </CardContent>
      </Card>
    </div>
  );
}
