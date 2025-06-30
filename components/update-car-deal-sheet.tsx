"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCarDeal } from "@/providers/car-deal-provider";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export function UpdateCarDealSheet({
  children,
}: {
  children: React.ReactNode;
}) {
  const { carDeal } = useCarDeal();

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update Car Deal</SheetTitle>
          <SheetDescription>Update the car deal details</SheetDescription>
        </SheetHeader>
        <form
          action={handleSubmit}
          className="grid flex-1 auto-rows-min gap-6 px-4 space-y-4"
        >
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., 2024 Tesla Model 3"
                required
                defaultValue={carDeal.title ?? ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of what you're looking for..."
                rows={3}
                defaultValue={carDeal.description ?? ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                placeholder="https://example.com/image.jpg"
                defaultValue={carDeal.image_url ?? ""}
              />
            </div>
          </div>
        </form>
        <SheetFooter>
          <Button type="submit">Update Car Deal</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
