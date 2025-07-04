import { notFound } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CarDealSidebar } from "@/components/car-deal-sidebar";
import { Analytics } from "@vercel/analytics/next";
import { OfferProvider } from "@/providers/offer-provider";

interface DealsPageProps {
  children: React.ReactNode;
  params: { carDealId: string };
}

export default async function DealsPage({ children, params }: DealsPageProps) {
  try {
    const { carDealId } = params;

    return (
      <OfferProvider carDealId={carDealId}>
        <SidebarProvider>
          <CarDealSidebar />
          <SidebarInset>
            <div className="p-6">{children}</div>
          </SidebarInset>
          <Analytics />
        </SidebarProvider>
      </OfferProvider>
    );
  } catch {
    notFound();
  }
}
