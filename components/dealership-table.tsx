"use client";

import { Calendar, MapPin, Users } from "lucide-react";
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
import { useCarDeal } from "@/providers/car-deal-provider";

export function DealershipsTable() {
  const { dealerships, contacts, deals } = useCarDeal();

  // Helper function to get contact count for a dealership
  const getContactCount = (dealershipId: string) => {
    return contacts.filter((contact) => contact.dealership_id === dealershipId)
      .length;
  };

  // Helper function to get deals count for a dealership
  const getDealsCount = (dealershipId: string) => {
    return deals.filter((deal) => deal.dealership_id === dealershipId).length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Dealerships ({dealerships.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dealership Name</TableHead>
              <TableHead>Contacts</TableHead>
              <TableHead>Active Deals</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dealerships.map((dealership) => {
              const contactCount = getContactCount(dealership.id);
              const dealsCount = getDealsCount(dealership.id);

              return (
                <TableRow key={dealership.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="font-medium">{dealership.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{contactCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={dealsCount > 0 ? "default" : "secondary"}>
                      {dealsCount} {dealsCount === 1 ? "deal" : "deals"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {dealership.created_at ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(dealership.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={dealsCount > 0 ? "default" : "secondary"}>
                      {dealsCount > 0 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
