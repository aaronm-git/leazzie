import { Plus } from "lucide-react";
import { Button } from "./ui/button";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { DialogTrigger } from "./ui/dialog";

import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/database.types";
import { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useOffers } from "@/providers/offer-provider";
import { useParams } from "next/navigation";
import AddDealershipDialog from "./add-dealership-dialog";
import AddContactDialog from "./add-contact-dialog";

export default function AddDealDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Deal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
        </DialogHeader>
        <AddDealForm />
      </DialogContent>
    </Dialog>
  );
}

function AddDealForm() {
  const supabase = createClient();
  const { createOffer, refreshOffers } = useOffers();
  const params = useParams();
  const carDealId = params.carDealId as string;

  const [dealerships, setDealerships] = useState<Tables<"dealerships">[]>([]);
  const [contacts, setContacts] = useState<Tables<"contacts">[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null,
  );
  const [formData, setFormData] = useState<Partial<Tables<"offers">>>({
    product_title: "",
    product_image_url: "",
    product_link: "",
    product_specs: "",
    additional_fees: null,
    car_deal_id: carDealId,
    dealer_incentives: null,
    dealership_id: null,
    down_payment: null,
    interest_rate: null,
    is_disqualified: false,
    lease_term: null,
    msrp: null,
    residual_value: null,
    selling_price: null,
    tax_rate: null,
  });

  // Fetch dealerships and contacts
  useEffect(() => {
    const fetchData = async () => {
      const [dealershipsRes, contactsRes] = await Promise.all([
        supabase.from("dealerships").select("*"),
        supabase.from("contacts").select("*"),
      ]);

      if (dealershipsRes.data) setDealerships(dealershipsRes.data);
      if (contactsRes.data) setContacts(contactsRes.data);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data for insertion
    const insertData = {
      product_title: formData.product_title!,
      product_image_url: formData.product_image_url,
      product_link: formData.product_link,
      product_specs: formData.product_specs,
      additional_fees: formData.additional_fees,
      car_deal_id: carDealId,
      dealer_incentives: formData.dealer_incentives,
      dealership_id: formData.dealership_id,
      contact_id: selectedContactId,
      down_payment: formData.down_payment,
      interest_rate: formData.interest_rate,
      is_disqualified: formData.is_disqualified,
      lease_term: formData.lease_term,
      msrp: formData.msrp,
      residual_value: formData.residual_value,
      selling_price: formData.selling_price,
      tax_rate: formData.tax_rate,
    };

    const result = await createOffer(insertData);
    if (result) {
      console.log("Deal added successfully");
      // Reset form
      setFormData({
        product_title: "",
        product_image_url: "",
        product_link: "",
        product_specs: "",
        additional_fees: null,
        car_deal_id: carDealId,
        dealer_incentives: null,
        dealership_id: null,
        down_payment: null,
        interest_rate: null,
        is_disqualified: false,
        lease_term: null,
        msrp: null,
        residual_value: null,
        selling_price: null,
        tax_rate: null,
      });
      setSelectedContactId(null);
    }
  };

  const handleChange = (
    field: keyof Tables<"offers">,
    value: string | number | null,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Product Information</h3>

        <div className="grid gap-2">
          <Label htmlFor="product_title">Product Title *</Label>
          <Input
            id="product_title"
            name="product_title"
            placeholder="e.g., 2024 BMW X3 xDrive30i"
            value={formData?.product_title || ""}
            onChange={(e) => handleChange("product_title", e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="product_image_url">Product Image URL</Label>
          <Input
            id="product_image_url"
            name="product_image_url"
            placeholder="https://example.com/car-image.jpg"
            value={formData?.product_image_url || ""}
            onChange={(e) => handleChange("product_image_url", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="product_link">Product Link</Label>
          <Input
            id="product_link"
            name="product_link"
            placeholder="https://dealership.com/car-listing"
            value={formData?.product_link || ""}
            onChange={(e) => handleChange("product_link", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="product_specs">Product Specifications</Label>
          <Input
            id="product_specs"
            name="product_specs"
            placeholder="e.g., AWD, Premium Package, Navigation"
            value={formData?.product_specs || ""}
            onChange={(e) => handleChange("product_specs", e.target.value)}
          />
        </div>
      </div>

      {/* Pricing Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Pricing Information</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="msrp">MSRP ($)</Label>
            <Input
              id="msrp"
              name="msrp"
              type="number"
              placeholder="45000"
              value={formData?.msrp || ""}
              onChange={(e) =>
                handleChange(
                  "msrp",
                  e.target.value ? parseFloat(e.target.value) : null,
                )
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="selling_price">Selling Price ($)</Label>
            <Input
              id="selling_price"
              name="selling_price"
              type="number"
              placeholder="42000"
              value={formData?.selling_price || ""}
              onChange={(e) =>
                handleChange(
                  "selling_price",
                  e.target.value ? parseFloat(e.target.value) : null,
                )
              }
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="down_payment">Down Payment ($)</Label>
            <Input
              id="down_payment"
              name="down_payment"
              type="number"
              placeholder="3000"
              value={formData?.down_payment || ""}
              onChange={(e) =>
                handleChange(
                  "down_payment",
                  e.target.value ? parseFloat(e.target.value) : null,
                )
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="additional_fees">Additional Fees ($)</Label>
            <Input
              id="additional_fees"
              name="additional_fees"
              type="number"
              placeholder="500"
              value={formData?.additional_fees || ""}
              onChange={(e) =>
                handleChange(
                  "additional_fees",
                  e.target.value ? parseFloat(e.target.value) : null,
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Dealership & Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          Dealership & Contact Information
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Dealership Selection */}
          <div className="space-y-2">
            <Label htmlFor="dealership">Dealership *</Label>
            {dealerships && dealerships.length > 0 && (
              <Select
                value={formData?.dealership_id || ""}
                onValueChange={(value) =>
                  handleChange("dealership_id", value || null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a dealership" />
                </SelectTrigger>
                <SelectContent>
                  {dealerships.map((dealership) => (
                    <SelectItem key={dealership.id} value={dealership.id}>
                      {dealership.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <AddDealershipDialog
              onDealershipCreated={(dealershipId) => {
                handleChange("dealership_id", dealershipId);
              }}
            />
          </div>

          {/* Contact Selection */}
          <div className="space-y-2">
            <Label htmlFor="contact">Contact (Optional)</Label>
            {contacts && contacts.length > 0 && (
              <Select
                value={selectedContactId || ""}
                onValueChange={(value) => setSelectedContactId(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts
                    .filter(
                      (contact) =>
                        !formData.dealership_id ||
                        contact.dealership_id === formData.dealership_id,
                    )
                    .map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name} {contact.title && `(${contact.title})`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
            <AddContactDialog
              onContactCreated={(contactId) => {
                setSelectedContactId(contactId);
              }}
            />
          </div>
        </div>
      </div>

      {/* Lease Terms */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Lease Terms</h3>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="lease_term">Lease Term (months)</Label>
            <Input
              id="lease_term"
              name="lease_term"
              type="number"
              placeholder="36"
              value={formData?.lease_term || ""}
              onChange={(e) =>
                handleChange(
                  "lease_term",
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="interest_rate">Interest Rate (%)</Label>
            <Input
              id="interest_rate"
              name="interest_rate"
              type="number"
              step="0.01"
              placeholder="2.99"
              value={formData?.interest_rate || ""}
              onChange={(e) =>
                handleChange(
                  "interest_rate",
                  e.target.value ? parseFloat(e.target.value) : null,
                )
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tax_rate">Tax Rate (%)</Label>
            <Input
              id="tax_rate"
              name="tax_rate"
              type="number"
              step="0.01"
              placeholder="8.25"
              value={formData?.tax_rate || ""}
              onChange={(e) =>
                handleChange(
                  "tax_rate",
                  e.target.value ? parseFloat(e.target.value) : null,
                )
              }
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="residual_value">Residual Value ($)</Label>
            <Input
              id="residual_value"
              name="residual_value"
              type="number"
              placeholder="25000"
              value={formData?.residual_value || ""}
              onChange={(e) =>
                handleChange(
                  "residual_value",
                  e.target.value ? parseFloat(e.target.value) : null,
                )
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dealer_incentives">Dealer Incentives ($)</Label>
            <Input
              id="dealer_incentives"
              name="dealer_incentives"
              type="number"
              placeholder="1000"
              value={formData?.dealer_incentives || ""}
              onChange={(e) =>
                handleChange(
                  "dealer_incentives",
                  e.target.value ? parseFloat(e.target.value) : null,
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 border-t pt-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Add Deal</Button>
      </div>
    </form>
  );
}
