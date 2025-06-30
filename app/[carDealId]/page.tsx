import { notFound } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CarDealSidebar } from "@/components/car-deal-sidebar";
import { CarDealHeader } from "@/components/car-deal-header";
import { CarDealContent } from "@/components/car-deal-content";
import { CarDealProvider } from "@/providers/car-deal-provider";
import { fetchCarDealData } from "@/lib/car-deal-data";

export default async function DealsPage({
  params,
}: {
  params: Promise<{ carDealId: string }>;
}) {
  const { carDealId } = await params;

  try {
    const data = await fetchCarDealData(carDealId);

    const contextValue = {
      ...data,
      carDealId,
    };

    return (
      <CarDealProvider value={contextValue}>
        <SidebarProvider>
          <CarDealSidebar />
          <SidebarInset>
            <div className="p-6">
              <CarDealHeader />
              <CarDealContent />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </CarDealProvider>
    );
  } catch {
    notFound();
  }
}
