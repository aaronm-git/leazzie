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
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useParams } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Tables } from "@/database.types";

export function UpdateCarDealSheet({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const carDealId = params.carDealId as string;

  const [carDeal, setCarDeal] = useState<Tables<"car_deals"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarDeal = async () => {
      try {
        const { data, error } = await supabase
          .from("car_deals")
          .select("*")
          .eq("id", carDealId)
          .single();

        if (error) {
          console.error("Error fetching car deal:", error);
          return;
        }

        if (data) {
          setCarDeal(data);
        }
      } catch (error) {
        console.error("Error fetching car deal:", error);
      } finally {
        setLoading(false);
      }
    };

    if (carDealId) {
      fetchCarDeal();
    }
  }, [carDealId, supabase]);

  const handleSubmit = async (formData: FormData) => {
    if (!carDeal) return;

    console.log("handleSubmit");
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image_url = formData.get("image_url") as string;

    const { error } = await supabase
      .from("car_deals")
      .update({ title, description, image_url })
      .eq("id", carDeal.id);

    if (error) {
      toast.error("Failed to update car deal");
      console.error(error);
    } else {
      toast.success("Car deal updated successfully");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!carDeal) return;

    const { error } = await supabase
      .from("car_deals")
      .delete()
      .eq("id", carDeal.id);

    if (error) {
      toast.error("Failed to delete car deal");
      console.error(error);
    } else {
      toast.success("Car deal deleted successfully");
      router.push("/");
    }
  };

  if (loading || !carDeal) {
    return (
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Loading...</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update Car Deal</SheetTitle>
          <SheetDescription>Update the car deal details</SheetDescription>
        </SheetHeader>
        <form
          id="update-car-deal-form"
          action={handleSubmit}
          className="grid flex-1 auto-rows-min gap-6 space-y-4 px-4"
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
          <Button type="submit" form="update-car-deal-form">
            Update Car Deal
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="destructive">
                Delete Car Deal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Car Deal</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to delete the <b>{carDeal.title}</b> car
                deal?
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Cancel</Button>
                </DialogClose>
                <Button
                  type="button"
                  onClick={handleDelete}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Car Deal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
