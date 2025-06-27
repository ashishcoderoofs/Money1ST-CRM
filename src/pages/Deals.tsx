import { useState } from "react";
import { useDeals } from "@/hooks/useDeals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DealForm } from "@/components/DealForm";
import { DealsTab } from "@/components/deals/DealsTab";
import { Plus, DollarSign, Calendar, Edit, User, Paperclip } from "lucide-react";

export default function Deals() {
  const { data: deals, isLoading } = useDeals();
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingDeal, setViewingDeal] = useState<any>(null);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Lead": return "bg-gray-500";
      case "Qualified": return "bg-blue-500";
      case "Proposal": return "bg-yellow-500";
      case "Negotiation": return "bg-orange-500";
      case "Closed Won": return "bg-green-500";
      case "Closed Lost": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading deals...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Deals</h2>
          <p className="text-muted-foreground">Track your sales pipeline</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedDeal(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedDeal ? "Edit Deal" : "Add New Deal"}
              </DialogTitle>
            </DialogHeader>
            <DealForm 
              deal={selectedDeal} 
              onClose={() => setIsDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals?.map((deal) => (
          <Card key={deal.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{deal.title}</CardTitle>
                  <CardDescription>
                    Created {new Date(deal.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewingDeal(deal)}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedDeal(deal);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Badge className={`${getStageColor(deal.stage)} text-white w-fit`}>
                {deal.stage}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {deal.amount && (
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                  <span className="font-semibold">${deal.amount.toLocaleString()}</span>
                  {deal.probability && (
                    <span className="text-muted-foreground ml-2">
                      ({deal.probability}%)
                    </span>
                  )}
                </div>
              )}
              {deal.expected_close_date && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Expected close: {new Date(deal.expected_close_date).toLocaleDateString()}
                </div>
              )}
              {deal.contact && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  {deal.contact.first_name} {deal.contact.last_name}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Deal Details Dialog with Attachments */}
      <Dialog open={!!viewingDeal} onOpenChange={() => setViewingDeal(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{viewingDeal?.title}</DialogTitle>
          </DialogHeader>
          {viewingDeal && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Stage:</span>
                    <Badge className={`${getStageColor(viewingDeal.stage)} text-white ml-2`}>
                      {viewingDeal.stage}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Amount:</span> 
                    {viewingDeal.amount ? `$${viewingDeal.amount.toLocaleString()}` : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Probability:</span> 
                    {viewingDeal.probability ? `${viewingDeal.probability}%` : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Expected Close:</span> 
                    {viewingDeal.expected_close_date 
                      ? new Date(viewingDeal.expected_close_date).toLocaleDateString() 
                      : "N/A"
                    }
                  </div>
                  {viewingDeal.contact && (
                    <div className="col-span-2">
                      <span className="font-medium">Contact:</span> 
                      {viewingDeal.contact.first_name} {viewingDeal.contact.last_name}
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="attachments">
                <DealsTab deal={viewingDeal} />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {deals?.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground mb-4">No deals found</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setSelectedDeal(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Deal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Deal</DialogTitle>
                </DialogHeader>
                <DealForm onClose={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
