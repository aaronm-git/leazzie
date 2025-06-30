import { CarDealsGrid } from "@/components/car-deals-grid";
import { LeaseCalculator } from "@/components/lease-calculator";
import { createClient } from "@/utils/supabase/client";

// use supabase to get the car deals
const supabase = createClient();

export default async function Home() {
  const { data: carDeals, error } = await supabase
    .from("car_deals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="">
      <CarDealsGrid initialCarDeals={carDeals || []} />
      <div className="border-t border-gray-200 mt-12">
        <LeaseCalculator />
      </div>
    </div>
  );
}
