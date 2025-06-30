import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { DialogTrigger } from "./ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/database.types";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useCarDeal } from "@/providers/car-deal-provider";

export default function AddDealershipDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Dealership
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Dealership</DialogTitle>
        </DialogHeader>
        <AddDealershipForm />
      </DialogContent>
    </Dialog>
  );
}

function AddDealershipForm() {
  const supabase = createClient();
  const { carDeal } = useCarDeal();
  const [formData, setFormData] = useState<Partial<Tables<"dealerships">>>({
    name: "",
    car_deal_id: carDeal?.id || null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("dealerships").insert({
      ...formData,
      name: formData.name || "",
      car_deal_id: carDeal?.id || null,
    });
    if (error) {
      console.error("Error adding dealership:", error);
    } else {
      console.log("Dealership added successfully");
      // Reset form
      setFormData({
        name: "",
        car_deal_id: carDeal?.id || null,
      });
    }
  };

  const handleChange = (
    field: keyof Tables<"dealerships">,
    value: string | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Dealership Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., BMW of Downtown"
          value={formData?.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Add Dealership</Button>
      </div>
    </form>
  );
}
