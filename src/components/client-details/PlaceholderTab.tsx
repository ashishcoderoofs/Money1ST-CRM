
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlaceholderTab({ label }: { label: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground">
          {label} functionality is coming soon.
        </div>
      </CardContent>
    </Card>
  );
}
