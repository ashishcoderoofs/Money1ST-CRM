
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { usePayments } from "@/hooks/usePayments";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentsTabProps {
  consultantId: string;
}

export function PaymentsTab({ consultantId }: PaymentsTabProps) {
  const { data: payments, isLoading } = usePayments(consultantId);

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Payments</CardTitle>
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
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {payments && payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.payment_type}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          payment.status === 'Processed' 
                            ? 'default' 
                            : payment.status === 'Cancelled' 
                            ? 'destructive' 
                            : 'secondary'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.description || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No payments found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
