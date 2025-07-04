import { createClient } from "@/utils/supabase/client";
import type { Tables } from "@/database.types";
import type { DealWithDealership } from "@/types/car-deal";

interface CarDealData {
  carDeal: Tables<'car_deals'>;
  allCarDeals: Tables<'car_deals'>[];
  deals: DealWithDealership[];
  dealerships: Tables<'dealerships'>[];
  contacts: Tables<'contacts'>[];
}

export async function fetchCarDealData(carDealId: string): Promise<CarDealData> {
  const supabase = createClient();

  // Fetch car deal details
  const { data: carDeal } = await supabase
    .from("car_deals")
    .select("*")
    .eq("id", carDealId)
    .single();

  if (!carDeal) {
    throw new Error("Car deal not found");
  }

  // Fetch all car deals for the switcher
  const { data: allCarDeals } = await supabase
    .from("car_deals")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch deals with dealership info
  const { data: deals } = await supabase
    .from("offers")
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

  return {
    carDeal,
    allCarDeals: allCarDeals || [],
    deals: deals || [],
    dealerships: dealerships || [],
    contacts: contacts || [],
  };
} 