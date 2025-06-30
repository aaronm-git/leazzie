import { FileText, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EmptyDealsState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No deals yet</h3>
        <p className="text-muted-foreground text-center mb-4">
          Start tracking lease deals for this car by adding your first offer.
        </p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add First Deal
        </Button>
      </CardContent>
    </Card>
  );
}
