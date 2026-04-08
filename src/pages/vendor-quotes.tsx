import { useState } from "react";
import { useQuotesStore, Quote } from "@/store/useQuotesStore";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function VendorQuotes() {
  const { quotes } = useQuotesStore();
  const [activeTab, setActiveTab] = useState("Pending");

  const columns: ColumnDef<Quote>[] = [
    {
      accessorKey: "vendorName",
      header: "Vendor",
      cell: ({ row }) => <div className="font-medium">{row.getValue("vendorName")}</div>,
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
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge 
            variant={
              status === "Approved" ? "secondary" :
              status === "Received" ? "default" :
              "outline"
            }
          >
            {status}
          </Badge>
        );
      }
    },
    {
      accessorKey: "submittedDate",
      header: "Submitted",
      cell: ({ row }) => <div>{format(new Date(row.getValue("submittedDate")), "MMM d, yyyy")}</div>,
    },
    {
      accessorKey: "validUntil",
      header: "Valid Until",
      cell: ({ row }) => <div>{format(new Date(row.getValue("validUntil")), "MMM d, yyyy")}</div>,
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => <div className="max-w-[200px] truncate text-muted-foreground">{row.getValue("notes")}</div>,
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Vendor Quotes</h2>
        <p className="text-muted-foreground">Manage and compare incoming quotes from vendors.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="Pending">Pending ({quotes.filter(q => q.status === 'Pending').length})</TabsTrigger>
          <TabsTrigger value="Received">Received ({quotes.filter(q => q.status === 'Received').length})</TabsTrigger>
          <TabsTrigger value="Approved">Approved ({quotes.filter(q => q.status === 'Approved').length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="Pending" className="mt-0">
          <DataTable 
            columns={columns} 
            data={quotes.filter(q => q.status === 'Pending')} 
            searchKey="vendorName" 
            searchPlaceholder="Search vendors..." 
          />
        </TabsContent>
        
        <TabsContent value="Received" className="mt-0">
          <DataTable 
            columns={columns} 
            data={quotes.filter(q => q.status === 'Received')} 
            searchKey="vendorName" 
            searchPlaceholder="Search vendors..." 
          />
        </TabsContent>

        <TabsContent value="Approved" className="mt-0">
          <DataTable 
            columns={columns} 
            data={quotes.filter(q => q.status === 'Approved')} 
            searchKey="vendorName" 
            searchPlaceholder="Search vendors..." 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
