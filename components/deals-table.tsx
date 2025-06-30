"use client";

import { Calendar, MapPin } from "lucide-react";
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

export function DealsTable() {
  const { deals } = useCarDeal();

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Deals ({deals.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Dealership</TableHead>
              <TableHead>MSRP</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead>Down Payment</TableHead>
              <TableHead>Monthly Payment</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {deal.product_image_url && (
                      <img
                        src={deal.product_image_url}
                        alt={deal.product_title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <div className="font-medium">{deal.product_title}</div>
                      {deal.product_specs && (
                        <div className="text-sm text-muted-foreground">
                          {deal.product_specs}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {deal.dealerships?.name || "Unknown Dealership"}
                  </div>
                </TableCell>
                <TableCell>
                  {deal.msrp ? (
                    <span className="font-mono">
                      ${deal.msrp.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {deal.selling_price ? (
                    <span className="font-mono">
                      ${deal.selling_price.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {deal.down_payment ? (
                    <span className="font-mono">
                      ${deal.down_payment.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">$0</span>
                  )}
                </TableCell>
                <TableCell>
                  {deal.selling_price && deal.lease_term ? (
                    <span className="font-mono">
                      $
                      {Math.round(
                        deal.selling_price / deal.lease_term
                      ).toLocaleString()}
                      /mo
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {deal.lease_term ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{deal.lease_term} months</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {deal.is_disqualified ? (
                    <Badge variant="destructive">Disqualified</Badge>
                  ) : (
                    <Badge variant="default">Active</Badge>
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
