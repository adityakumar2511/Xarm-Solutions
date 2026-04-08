import { useState } from "react";
import { useEstimatesStore } from "@/store/useEstimatesStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function ClientEstimates() {
  const { estimates, duplicateVersion, markApproved, updateEstimate } = useEstimatesStore();
  const [selectedEstimateId, setSelectedEstimateId] = useState<string>(estimates[0]?.id || "");

  const selectedEstimate = estimates.find(e => e.id === selectedEstimateId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Client Estimates</h2>
        <p className="text-muted-foreground">Build, version, and approve client estimates.</p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar List */}
        <div className="w-80 flex flex-col gap-2 overflow-y-auto border-r pr-4">
          {estimates.map(estimate => (
            <Card 
              key={estimate.id} 
              className={`cursor-pointer transition-colors ${selectedEstimateId === estimate.id ? 'border-primary shadow-sm bg-primary/5' : 'hover:bg-muted/50'}`}
              onClick={() => setSelectedEstimateId(estimate.id)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-base">{estimate.clientName}</CardTitle>
                <CardDescription>{estimate.eventName}</CardDescription>
                <div className="mt-2 flex gap-1 flex-wrap">
                  {estimate.versions.map(v => (
                    <Badge key={v.id} variant={v.status === 'Approved' ? 'secondary' : v.status === 'Rejected' ? 'destructive' : 'outline'} className="text-[10px] px-1 py-0 h-4">
                      {v.version}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pl-2">
          {selectedEstimate ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">{selectedEstimate.clientName} - {selectedEstimate.eventName}</h3>
                  <p className="text-sm text-muted-foreground">Estimate ID: {selectedEstimate.id}</p>
                </div>
              </div>

              <Tabs defaultValue={selectedEstimate.versions[selectedEstimate.versions.length - 1]?.id} className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                  {selectedEstimate.versions.map(version => (
                    <TabsTrigger 
                      key={version.id} 
                      value={version.id}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                      {version.version}
                      <Badge 
                        variant={version.status === 'Approved' ? 'secondary' : version.status === 'Rejected' ? 'destructive' : 'outline'} 
                        className="ml-2 text-[10px] uppercase"
                      >
                        {version.status}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {selectedEstimate.versions.map(version => {
                  const totalAmount = version.items.reduce((acc, item) => acc + item.total, 0);
                  
                  return (
                    <TabsContent key={version.id} value={version.id} className="mt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-muted-foreground">Created: {version.createdAt}</div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => duplicateVersion(selectedEstimate.id, version.id)}
                            disabled={selectedEstimate.versions.length >= 3}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate to {selectedEstimate.versions.length === 1 ? 'v2' : 'v3'}
                          </Button>
                          {version.status !== 'Approved' && (
                            <Button size="sm" onClick={() => markApproved(selectedEstimate.id, version.id)}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Approved
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="rounded-md border bg-card">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Description</TableHead>
                              <TableHead className="w-24 text-right">Qty</TableHead>
                              <TableHead className="w-32 text-right">Rate</TableHead>
                              <TableHead className="w-32 text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {version.items.map(item => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  {version.status === 'Draft' ? (
                                    <Input defaultValue={item.description} className="h-8" />
                                  ) : (
                                    item.description
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {version.status === 'Draft' ? (
                                    <Input type="number" defaultValue={item.qty} className="h-8 text-right" />
                                  ) : (
                                    item.qty
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {version.status === 'Draft' ? (
                                    <Input type="number" defaultValue={item.rate} className="h-8 text-right" />
                                  ) : (
                                    `$${item.rate.toLocaleString()}`
                                  )}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  ${item.total.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                            {version.status === 'Draft' && (
                              <TableRow>
                                <TableCell colSpan={4}>
                                  <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                                    <Plus className="w-4 h-4 mr-2" /> Add Line Item
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )}
                            <TableRow className="bg-muted/50 font-bold">
                              <TableCell colSpan={3} className="text-right uppercase">Total Estimate</TableCell>
                              <TableCell className="text-right text-lg">${totalAmount.toLocaleString()}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select an estimate to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
