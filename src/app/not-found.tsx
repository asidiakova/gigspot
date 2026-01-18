import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="page-section flex flex-col items-center justify-center text-center min-h-[70vh] animate-fade-in">
      <div className="icon-container mb-6" style={{ padding: "1.5rem" }}>
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        Oops! The page you are looking for seems to have gone missing or never existed in the first place...
      </p>
      <div className="flex gap-4">
        <Button asChild variant="default" size="lg">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}

