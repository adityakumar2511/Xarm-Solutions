import { useEventsStore, Event } from "@/store/useEventsStore";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

export default function EventsHealth() {
  const { events } = useEventsStore();

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "name",
      header: "Event Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const colorClass = 
          status === "Active" ? "bg-blue-500" :
          status === "Completed" ? "bg-green-500" :
          status === "Cancelled" ? "bg-red-500" :
          "bg-gray-500";
          
        return (
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${colorClass}`} />
            <span>{status}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
      cell: ({ row }) => {
        const status = row.getValue("paymentStatus") as string;
        return (
          <Badge 
            variant={
              status === "Paid" ? "secondary" :
              status === "Overdue" ? "destructive" :
              "default"
            }
          >
            {status}
          </Badge>
        );
      }
    },
    {
      accessorKey: "margin",
      header: "Margin %",
      cell: ({ row }) => {
        const margin = row.getValue("margin") as number;
        return (
          <div className={`font-medium ${margin < 30 ? "text-red-500" : "text-green-600"}`}>
            {margin}%
          </div>
        );
      },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const progress = row.getValue("progress") as number;
        return (
          <div className="w-[100px]">
            <Progress value={progress} className="h-2" />
            <span className="text-xs text-muted-foreground mt-1 inline-block">{progress}%</span>
          </div>
        );
      }
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        return <div>{format(new Date(row.getValue("dueDate")), "MMM d, yyyy")}</div>;
      }
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Events Health</h2>
        <p className="text-muted-foreground">Monitor margins, progress, and financial health.</p>
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
