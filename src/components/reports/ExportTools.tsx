
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Table, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function ExportTools() {
  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Generating ${format} report...`,
    });
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${format} report has been downloaded.`,
      });
    }, 2000);
  };

  return (
    <Card className="shadow-m1f border-m1f-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-m1f-primary">
          <Download className="h-5 w-5" />
          Export Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="flex flex-col items-center space-y-2 h-20"
            onClick={() => handleExport('PDF')}
          >
            <FileText className="h-6 w-6 text-m1f-primary" />
            <span>PDF</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center space-y-2 h-20"
            onClick={() => handleExport('Excel')}
          >
            <Table className="h-6 w-6 text-m1f-primary" />
            <span>Excel</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center space-y-2 h-20"
            onClick={() => handleExport('CSV')}
          >
            <FileText className="h-6 w-6 text-m1f-primary" />
            <span>CSV</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center space-y-2 h-20"
            onClick={() => handleExport('Chart')}
          >
            <BarChart3 className="h-6 w-6 text-m1f-primary" />
            <span>Charts</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
