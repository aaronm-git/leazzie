import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyTableState({
  addDealDialog,
  title,
  description,
}: {
  addDealDialog: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-center mb-4">{description}</p>
        {addDealDialog}
      </CardContent>
    </Card>
  );
}
