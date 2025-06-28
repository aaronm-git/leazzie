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
import { createCarDeal } from "@/lib/actions";
// import { useToast } from "@/hooks/use-toast"

interface AddCarDealDialogProps {
  children: React.ReactNode;
  onCarDealAdded: (carDeal: any) => void;
}

export function AddCarDealDialog({
  children,
  onCarDealAdded,
}: AddCarDealDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const { toast } = useToast()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const result = await createCarDeal(formData);

      if (result.error) {
        toast({
          title: "Error",
          description: "Failed to create car deal. Please try again.",
          variant: "destructive",
        });
      } else if (result.data) {
        toast({
          title: "Success",
          description: "Car deal created successfully!",
        });
        onCarDealAdded(result.data);
        setIsOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
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
