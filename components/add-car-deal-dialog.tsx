"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/database.types";

interface AddCarDealDialogProps {
  children: React.ReactNode;
  onCarDealAdded: (
    carDeal: Database["public"]["Tables"]["car_deals"]["Row"]
  ) => void;
}

export function AddCarDealDialog({
  children,
  onCarDealAdded,
}: AddCarDealDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const imageUrl = formData.get("image_url") as string;

      // Validate required fields
      if (!title?.trim()) {
        toast.error("Title is required");
        setIsLoading(false);
        return;
      }

      // Insert the car deal into Supabase
      const { data, error } = await supabase
        .from("car_deals")
        .insert([
          {
            title: title.trim(),
            description: description?.trim() || null,
            image_url: imageUrl?.trim() || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);

        // Handle specific Supabase errors
        if (error.code === "23505") {
          toast.error("A car deal with this title already exists");
        } else if (error.code === "42501") {
          toast.error("You don't have permission to create car deals");
        } else if (error.message.includes("network")) {
          toast.error(
            "Network error. Please check your connection and try again"
          );
        } else {
          toast.error(`Failed to create car deal: ${error.message}`);
        }
        return;
      }

      if (data) {
        toast.success("Car deal created successfully! 🚗");
        onCarDealAdded(data);
        setIsOpen(false);

        // Reset form by getting a fresh form reference
        const form = document.querySelector("form") as HTMLFormElement;
        if (form) {
          form.reset();
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Car Deal</DialogTitle>
            <DialogDescription>
              Add a new car deal to start tracking lease offers from different
              dealerships.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., 2024 Tesla Model 3"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of what you're looking for..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image_url">Image URL (optional)</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                placeholder="https://example.com/car-image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Car Deal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
