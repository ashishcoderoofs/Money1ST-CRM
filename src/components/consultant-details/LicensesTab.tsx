import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface LicensesTabProps {
  consultantId: string;
}

export function LicensesTab({ consultantId }: LicensesTabProps) {
  const licenses = [];
  const isLoading = false;

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Licenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Licenses</CardTitle>
        </CardHeader>
        <CardContent>
          {licenses && licenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Authority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licenses.map((license) => (
                  <TableRow key={license.id}>
                    <TableCell>{license.license_type}</TableCell>
                    <TableCell>{license.license_number || "N/A"}</TableCell>
                    <TableCell>
                      {license.issue_date ? new Date(license.issue_date).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      {license.expiration_date ? new Date(license.expiration_date).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>{license.issuing_authority || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No licenses found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
