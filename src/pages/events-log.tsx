import { useEventsStore, Event } from "@/store/useEventsStore";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventsLog() {
  const { events } = useEventsStore();

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Event Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium px-4">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "client",
      header: "Client",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        return <div>{format(new Date(row.getValue("date")), "MMM d, yyyy")}</div>;
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge 
            variant={
              status === "Active" ? "default" :
              status === "Completed" ? "secondary" :
              status === "Cancelled" ? "destructive" :
              "outline"
            }
          >
            {status}
          </Badge>
        );
      }
    },
    {
      accessorKey: "assignedTeam",
      header: "Assigned Team",
    },
    {
      accessorKey: "revenue",
      header: "Revenue",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("revenue"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Events Log</h2>
        <p className="text-muted-foreground">Manage and track all events.</p>
      </div>
      <DataTable 
        columns={columns} 
        data={events} 
        searchKey="name" 
        searchPlaceholder="Search events..." 
      />
    </div>
  );
}
