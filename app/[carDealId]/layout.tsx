import { notFound } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CarDealSidebar } from "@/components/car-deal-sidebar";
import { CarDealProvider } from "@/providers/car-deal-provider";
import { fetchCarDealData } from "@/lib/car-deal-data";
import { Analytics } from "@vercel/analytics/next"
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

    const initialData = {
      ...data,
      carDealId,
    };

    return (
      <CarDealProvider initialData={initialData}>
        <SidebarProvider>
          <CarDealSidebar />
          <SidebarInset>
            <div className="p-6">{children}</div>
          </SidebarInset>
          <Analytics />
        </SidebarProvider>
      </CarDealProvider>
    );
  } catch {
    notFound();
  }
}
