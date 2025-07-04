"use client";

import { useEffect, useState } from "react";
import { EmptyTableState } from "@/components/empty-table-state";
import AddContactDialog from "@/components/add-contact-dialog";
import { Users } from "lucide-react";
import { ContactsTable } from "@/components/contact-table";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/database.types";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Tables<"contacts">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data, error } = await supabase
          .from("contacts")
          .select(
            `
            *,
            dealerships!inner(id, name)
          `,
          )
          .order("created_at", { ascending: false });

        if (error) throw error;
        setContacts(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch contacts",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="mb-1 flex items-center gap-2 text-3xl font-bold">
            <Users className="h-7 w-7" />
            Contacts
          </h1>
          <p className="text-muted-foreground">
            All contacts for this car deal
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
        <ContactsTable contacts={contacts} />
      )}
    </>
  );
}
