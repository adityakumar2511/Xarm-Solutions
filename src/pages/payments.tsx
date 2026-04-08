import { useState } from "react";
import { usePaymentsStore, Payment } from "@/store/usePaymentsStore";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Payments() {
  const { payments, togglePaidStatus } = usePaymentsStore();
  const [activeTab, setActiveTab] = useState("Incoming");
  const [showOnlyUnpaid, setShowOnlyUnpaid] = useState(false);

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "invoiceRef",
      header: "Invoice Ref",
      cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("invoiceRef")}</div>,
    },
    {
      accessorKey: "party",
      header: activeTab === "Incoming" ? "Client" : "Vendor",
      cell: ({ row }) => <div className="font-medium">{row.getValue("party")}</div>,
    },
    {
      accessorKey: "eventName",
      header: "Event",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="font-bold">{formatted}</div>;
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => <div>{format(new Date(row.getValue("dueDate")), "MMM d, yyyy")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className="flex items-center gap-3">
            <Badge 
              variant={
                status === "Paid" ? "secondary" :
                status === "Overdue" ? "destructive" :
                "outline"
              }
              className="w-20 justify-center"
            >
              {status}
            </Badge>
            <Switch 
              checked={status === "Paid"} 
              onCheckedChange={() => togglePaidStatus(row.original.id)}
              aria-label="Toggle paid status"
            />
          </div>
        );
      }
    },
  ];

  const incomingPayments = payments.filter(p => p.type === 'Incoming' && (!showOnlyUnpaid || p.status !== 'Paid'));
  const outgoingPayments = payments.filter(p => p.type === 'Outgoing' && (!showOnlyUnpaid || p.status !== 'Paid'));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">Track incoming client payments and outgoing vendor invoices.</p>
        </div>
        <div className="flex items-center space-x-2 bg-card p-3 rounded-md border shadow-sm">
          <Switch 
            id="unpaid-filter" 
            checked={showOnlyUnpaid} 
            onCheckedChange={setShowOnlyUnpaid} 
          />
          <Label htmlFor="unpaid-filter">Show only unpaid/overdue</Label>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
          <TabsTrigger 
            value="Incoming"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-base"
          >
            Incoming (Clients)
          </TabsTrigger>
          <TabsTrigger 
            value="Outgoing"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 text-base"
          >
            Outgoing (Vendors)
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="Incoming" className="mt-0">
          <DataTable 
            columns={columns} 
            data={incomingPayments} 
            searchKey="party" 
            searchPlaceholder="Search clients..." 
          />
        </TabsContent>
        
        <TabsContent value="Outgoing" className="mt-0">
          <DataTable 
            columns={columns} 
            data={outgoingPayments} 
            searchKey="party" 
            searchPlaceholder="Search vendors..." 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
