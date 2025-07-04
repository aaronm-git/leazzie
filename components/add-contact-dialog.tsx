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

interface AddContactDialogProps {
  onContactCreated?: (contactId: string) => void;
}

export default function AddContactDialog({
  onContactCreated,
}: AddContactDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <AddContactForm
          onSuccess={(contactId) => {
            setOpen(false);
            onContactCreated?.(contactId);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

interface AddContactFormProps {
  onSuccess?: (contactId: string) => void;
}

function AddContactForm({ onSuccess }: AddContactFormProps) {
  const supabase = createClient();
  const [dealerships, setDealerships] = useState<Tables<"dealerships">[]>([]);
  const [formData, setFormData] = useState<Partial<Tables<"contacts">>>({
    name: "",
    email: "",
    phone: "",
    title: "",
    dealership_id: null,
  });

  useEffect(() => {
    const fetchDealerships = async () => {
      const { data } = await supabase.from("dealerships").select("*");

      if (data) setDealerships(data);
    };

    fetchDealerships();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent parent form submission
    const { data, error } = await supabase
      .from("contacts")
      .insert({
        ...formData,
        name: formData.name || "",
      })
      .select();
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
      // Call success callback with the new contact ID
      if (data && data[0] && onSuccess) {
        onSuccess(data[0].id);
      }
    }
  };

  const handleChange = (
    field: keyof Tables<"contacts">,
    value: string | null,
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

      <div className="flex justify-end space-x-2 border-t pt-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Add Contact</Button>
      </div>
    </form>
  );
}
