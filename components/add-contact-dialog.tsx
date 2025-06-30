import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { DialogTrigger } from "./ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/database.types";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCarDeal } from "@/providers/car-deal-provider";

export default function AddContactDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <AddContactForm />
      </DialogContent>
    </Dialog>
  );
}

function AddContactForm() {
  const supabase = createClient();
  const { carDeal, dealerships } = useCarDeal();
  const [formData, setFormData] = useState<Partial<Tables<"contacts">>>({
    name: "",
    email: "",
    phone: "",
    title: "",
    dealership_id: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("contacts").insert({
      ...formData,
      name: formData.name || "",
    });
    if (error) {
      console.error("Error adding contact:", error);
    } else {
      console.log("Contact added successfully");
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        title: "",
        dealership_id: null,
      });
    }
  };

  const handleChange = (
    field: keyof Tables<"contacts">,
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
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., John Smith"
          value={formData?.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g., Sales Manager"
          value={formData?.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@dealership.com"
          value={formData?.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="(555) 123-4567"
          value={formData?.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="dealership">Dealership</Label>
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
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Add Contact</Button>
      </div>
    </form>
  );
}
