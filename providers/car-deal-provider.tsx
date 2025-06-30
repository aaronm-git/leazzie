"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { CarDealContextType } from "../types/car-deal";
import { fetchCarDealData } from "@/lib/car-deal-data";
import { createClient } from "@/utils/supabase/client";

// Context creation
const CarDealContext = createContext<CarDealContextType | undefined>(undefined);

// Provider props
interface CarDealProviderProps {
  children: ReactNode;
  initialData: Omit<CarDealContextType, "refreshData" | "isLoading">;
}

// Provider component
export function CarDealProvider({
  children,
  initialData,
}: CarDealProviderProps) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const freshData = await fetchCarDealData(initialData.carDealId);
      setData({
        ...freshData,
        carDealId: initialData.carDealId,
      });
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [initialData.carDealId]);

  const refreshDealerships = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: dealerships } = await supabase
        .from("dealerships")
        .select("*")
        .eq("car_deal_id", initialData.carDealId);

      setData((prev) => ({
        ...prev,
        dealerships: dealerships || [],
      }));
    } catch (error) {
      console.error("Failed to refresh dealerships:", error);
    }
  }, [initialData.carDealId]);

  const refreshContacts = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: contacts } = await supabase
        .from("contacts")
        .select("*")
        .in("dealership_id", data.dealerships?.map((d) => d.id) || []);

      setData((prev) => ({
        ...prev,
        contacts: contacts || [],
      }));
    } catch (error) {
      console.error("Failed to refresh contacts:", error);
    }
  }, [data.dealerships]);

  const refreshDeals = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: deals } = await supabase
        .from("deals")
        .select(
          `
          *,
          dealerships ( name )
        `
        )
        .eq("car_deal_id", initialData.carDealId)
        .order("created_at", { ascending: false });

      setData((prev) => ({
        ...prev,
        deals: deals || [],
      }));
    } catch (error) {
      console.error("Failed to refresh deals:", error);
    }
  }, [initialData.carDealId]);

  const contextValue: CarDealContextType = {
    ...data,
    refreshData,
    refreshDealerships,
    refreshContacts,
    refreshDeals,
    isLoading,
  };

  return (
    <CarDealContext.Provider value={contextValue}>
      {children}
    </CarDealContext.Provider>
  );
}

// Hook for consuming context
export function useCarDeal() {
  const context = useContext(CarDealContext);
  if (context === undefined) {
    throw new Error("useCarDeal must be used within a CarDealProvider");
  }
  return context;
}
