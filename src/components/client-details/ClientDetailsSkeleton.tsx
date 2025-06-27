
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ClientDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Card className="p-6">
        <div className="h-6 w-2/5 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 w-1/4 bg-gray-200 rounded mb-1"></div>
        <div className="h-4 w-1/6 bg-gray-100 rounded"></div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="h-6 w-32 bg-gray-200 rounded" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 w-2/5 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
              <div className="h-4 w-1/3 bg-gray-100 rounded" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="h-6 w-20 bg-gray-200 rounded" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-4 w-1/4 bg-gray-200 rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
