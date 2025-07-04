"use client";

import { Calendar, Mail, Phone, User, Building } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/database.types";

interface ContactsTableProps {
  contacts: (Tables<"contacts"> & {
    dealerships?: Tables<"dealerships">;
  })[];
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  // Helper function to get dealership name for a contact
  const getDealershipName = (contact: ContactsTableProps["contacts"][0]) => {
    if (contact.dealerships?.name) {
      return contact.dealerships.name;
    }
    return contact.dealership_id ? "Unknown Dealership" : "No Dealership";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Contacts ({contacts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Dealership</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="text-muted-foreground h-4 w-4" />
                    <div className="font-medium">{contact.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {contact.title ? (
                    <Badge variant="outline">{contact.title}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {contact.email ? (
                    <div className="flex items-center gap-2">
                      <Mail className="text-muted-foreground h-4 w-4" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.email}
                      </a>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {contact.phone ? (
                    <div className="flex items-center gap-2">
                      <Phone className="text-muted-foreground h-4 w-4" />
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building className="text-muted-foreground h-4 w-4" />
                    <span>{getDealershipName(contact)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {contact.created_at ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      <span>
                        {new Date(contact.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
