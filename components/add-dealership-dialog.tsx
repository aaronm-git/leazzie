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

interface AddDealershipDialogProps {
  onDealershipCreated?: (dealershipId: string) => void;
}

export default function AddDealershipDialog({
  onDealershipCreated,
}: AddDealershipDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <AddDealershipForm
          onSuccess={(dealershipId) => {
            setOpen(false);
            onDealershipCreated?.(dealershipId);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

interface AddDealershipFormProps {
  onSuccess?: (dealershipId: string) => void;
}

function AddDealershipForm({ onSuccess }: AddDealershipFormProps) {
  const supabase = createClient();
  const { carDeal, refreshDealerships } = useCarDeal();
  const [formData, setFormData] = useState<Partial<Tables<"dealerships">>>({
    name: "",
    car_deal_id: carDeal?.id || null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent parent form submission
    const { data, error } = await supabase
      .from("dealerships")
      .insert({
        ...formData,
        name: formData.name || "",
        car_deal_id: carDeal?.id || null,
      })
      .select();
    if (error) {
      console.error("Error adding dealership:", error);
    } else {
      console.log("Dealership added successfully");
      // Refresh only dealerships to show the new dealership
      await refreshDealerships();
      // Reset form
      setFormData({
        name: "",
        car_deal_id: carDeal?.id || null,
      });
      // Call success callback with the new dealership ID
      if (data && data[0] && onSuccess) {
        onSuccess(data[0].id);
      }
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
