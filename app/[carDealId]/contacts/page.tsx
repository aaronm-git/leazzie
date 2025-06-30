"use client";

import { useCarDeal } from "@/providers/car-deal-provider";
import { EmptyTableState } from "@/components/empty-table-state";
import AddContactDialog from "@/components/add-contact-dialog";
import { Users } from "lucide-react";
import { ContactsTable } from "@/components/contact-table";

export default function ContactsPage() {
  const { carDeal, contacts } = useCarDeal();

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <Users className="h-7 w-7" />
            Contacts
          </h1>
          <p className="text-muted-foreground">
            All contacts for {carDeal.title}
          </p>
        </div>

        <AddContactDialog />
      </div>
      {!contacts || contacts.length === 0 ? (
        <EmptyTableState
          addDealDialog={<AddContactDialog />}
          title="No contacts yet"
          description="Start tracking lease deals for this car by adding your first contact."
        />
      ) : (
        <ContactsTable />
      )}
    </>
  );
}
