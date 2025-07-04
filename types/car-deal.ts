import type { Tables } from "@/database.types";

export interface DealWithDealership extends Tables<'offers'> {
  dealerships?: {
    name: string;
  } | null;
}

// Context data structure
export interface CarDealContextType {
  carDeal: Tables<'car_deals'>;
  allCarDeals: Tables<'car_deals'>[];
  deals: DealWithDealership[];
  dealerships: Tables<'dealerships'>[];
  contacts: Tables<'contacts'>[];
  carDealId: string;
  refreshData: () => Promise<void>;
  refreshDealerships: () => Promise<void>;
  refreshContacts: () => Promise<void>;
  refreshDeals: () => Promise<void>;
  isLoading: boolean;
} 