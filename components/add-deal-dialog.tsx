import { Plus } from "lucide-react";
import { Button } from "./ui/button";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { DialogTrigger } from "./ui/dialog";

import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/database.types";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function AddDealDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Deal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
  const [formData, setFormData] = useState<Tables<"deals">>({
    id: "",
    product_title: "",
    product_image_url: "",
    product_link: "",
    product_specs: "",
    additional_fees: null,
    car_deal_id: null,
    created_at: null,
    dealer_incentives: null,
    dealership_id: null,
    down_payment: null,
    interest_rate: null,
    is_disqualified: null,
    lease_term: null,
    msrp: null,
    residual_value: null,
    selling_price: null,
    tax_rate: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("deals").insert(formData);
    if (error) {
      console.error("Error adding deal:", error);
    } else {
      console.log("Deal added successfully");
    }
  };

  const handleChange = (
    field: keyof Tables<"deals">,
    value: string | number | null
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

        <div className="grid md:grid-cols-2 gap-4">
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
                  e.target.value ? parseFloat(e.target.value) : null
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
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
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
                  e.target.value ? parseFloat(e.target.value) : null
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
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Lease Terms */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Lease Terms</h3>

        <div className="grid md:grid-cols-3 gap-4">
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
                  e.target.value ? parseInt(e.target.value) : null
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
                  e.target.value ? parseFloat(e.target.value) : null
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
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
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
                  e.target.value ? parseFloat(e.target.value) : null
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
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Add Deal</Button>
      </div>
    </form>
  );
}
