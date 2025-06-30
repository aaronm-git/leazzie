"use client";

import { createContext, useContext, ReactNode } from "react";
import type { CarDealContextType } from "../types/car-deal";

// Context creation
const CarDealContext = createContext<CarDealContextType | undefined>(undefined);

// Provider props
interface CarDealProviderProps {
  children: ReactNode;
  value: CarDealContextType;
}

// Provider component
export function CarDealProvider({ children, value }: CarDealProviderProps) {
  return (
    <CarDealContext.Provider value={value}>{children}</CarDealContext.Provider>
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
