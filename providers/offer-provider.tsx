"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/database.types";

type Offer = Database["public"]["Tables"]["offers"]["Row"];
type OfferInsert = Database["public"]["Tables"]["offers"]["Insert"];
type OfferUpdate = Database["public"]["Tables"]["offers"]["Update"];

interface OfferContextType {
  offers: Offer[];
  loading: boolean;
  error: string | null;
  createOffer: (offer: OfferInsert) => Promise<Offer | null>;
  updateOffer: (id: string, updates: OfferUpdate) => Promise<Offer | null>;
  deleteOffer: (id: string) => Promise<boolean>;
  getOffersByCarDeal: (carDealId: string) => Promise<Offer[]>;
  getOffersByDealership: (dealershipId: string) => Promise<Offer[]>;
  refreshOffers: () => Promise<void>;
}

const OfferContext = createContext<OfferContextType | undefined>(undefined);

export function useOffers() {
  const context = useContext(OfferContext);
  if (!context) {
    throw new Error("useOffers must be used within an OfferProvider");
  }
  return context;
}

interface OfferProviderProps {
  children: ReactNode;
  carDealId?: string; // Optional filter for specific car deal
}

export function OfferProvider({ children, carDealId }: OfferProviderProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch offers
  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("offers")
        .select(
          `
          *,
          car_deals(id, title),
          dealerships(id, name),
          contacts(id, name, title)
        `,
        )
        .order("created_at", { ascending: false });

      // Filter by car deal if provided
      if (carDealId) {
        query = query.eq("car_deal_id", carDealId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setOffers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Create offer
  const createOffer = async (offer: OfferInsert): Promise<Offer | null> => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from("offers")
        .insert(offer)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setOffers((prev) => [data, ...prev]);
        return data;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create offer");
      return null;
    }
  };

  // Update offer
  const updateOffer = async (
    id: string,
    updates: OfferUpdate,
  ): Promise<Offer | null> => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from("offers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setOffers((prev) =>
          prev.map((offer) => (offer.id === id ? data : offer)),
        );
        return data;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update offer");
      return null;
    }
  };

  // Delete offer
  const deleteOffer = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const { error } = await supabase.from("offers").delete().eq("id", id);

      if (error) {
        throw error;
      }

      setOffers((prev) => prev.filter((offer) => offer.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete offer");
      return false;
    }
  };

  // Get offers by car deal
  const getOffersByCarDeal = async (carDealId: string): Promise<Offer[]> => {
    try {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("car_deal_id", carDealId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch offers");
      return [];
    }
  };

  // Get offers by dealership
  const getOffersByDealership = async (
    dealershipId: string,
  ): Promise<Offer[]> => {
    try {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("dealership_id", dealershipId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch offers");
      return [];
    }
  };

  // Refresh offers
  const refreshOffers = async () => {
    await fetchOffers();
  };

  // Load offers on mount
  useEffect(() => {
    fetchOffers();
  }, [carDealId]);

  const value: OfferContextType = {
    offers,
    loading,
    error,
    createOffer,
    updateOffer,
    deleteOffer,
    getOffersByCarDeal,
    getOffersByDealership,
    refreshOffers,
  };

  return (
    <OfferContext.Provider value={value}>{children}</OfferContext.Provider>
  );
}

// Additional hook for offer calculations
export function useOfferCalculations() {
  const calculateMonthlyPayment = (offer: Offer): number => {
    const {
      selling_price = 0,
      residual_value = 0,
      interest_rate = 0,
      lease_term = 36,
      down_payment = 0,
      dealer_incentives = 0,
      additional_fees = 0,
      tax_rate = 0,
    } = offer;

    // Ensure we have valid numbers (handle null values)
    const validSellingPrice = selling_price ?? 0;
    const validResidualValue = residual_value ?? 0;
    const validInterestRate = interest_rate ?? 0;
    const validLeaseTerm = lease_term ?? 36;
    const validDealerIncentives = dealer_incentives ?? 0;
    const validAdditionalFees = additional_fees ?? 0;
    const validTaxRate = tax_rate ?? 0;

    // Calculate depreciation
    const depreciation =
      validSellingPrice - validResidualValue - validDealerIncentives;
    const monthlyDepreciation = depreciation / validLeaseTerm;

    // Calculate finance charge
    const monthlyFinanceCharge =
      ((validSellingPrice + validResidualValue) * (validInterestRate / 100)) /
      12;

    // Calculate base monthly payment
    const baseMonthlyPayment = monthlyDepreciation + monthlyFinanceCharge;

    // Add fees and taxes
    const monthlyFees = validAdditionalFees / validLeaseTerm;
    const monthlyTax =
      (baseMonthlyPayment + monthlyFees) * (validTaxRate / 100);

    return baseMonthlyPayment + monthlyFees + monthlyTax;
  };

  const calculateTotalCost = (offer: Offer): number => {
    const monthlyPayment = calculateMonthlyPayment(offer);
    const validLeaseTerm = offer.lease_term ?? 36;
    const validDownPayment = offer.down_payment ?? 0;
    return monthlyPayment * validLeaseTerm + validDownPayment;
  };

  const calculateEffectiveMonthlyPayment = (offer: Offer): number => {
    const totalCost = calculateTotalCost(offer);
    const validLeaseTerm = offer.lease_term ?? 36;
    return totalCost / validLeaseTerm;
  };

  return {
    calculateMonthlyPayment,
    calculateTotalCost,
    calculateEffectiveMonthlyPayment,
  };
}
