import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              We encountered an unexpected error. Please try again or contact
              support if the problem persists.
            </AlertDescription>
          </Alert>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/">Go back home</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">Try logging in again</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
