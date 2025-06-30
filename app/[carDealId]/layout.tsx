import { notFound } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CarDealSidebar } from "@/components/car-deal-sidebar";
import { CarDealProvider } from "@/providers/car-deal-provider";
import { fetchCarDealData } from "@/lib/car-deal-data";

export default async function DealsPage({
  children,
  params,
}: {
  children: React.ReactNode;
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
            <div className="p-6">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </CarDealProvider>
    );
  } catch {
    notFound();
  }
}
