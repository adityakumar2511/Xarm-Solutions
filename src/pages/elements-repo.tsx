import { useElementsStore, ElementItem } from "@/store/useElementsStore";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export default function ElementsRepo() {
  const { elements } = useElementsStore();

  const columns: ColumnDef<ElementItem>[] = [
    {
      accessorKey: "name",
      header: "Item Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const qty = row.getValue("quantity") as number;
        return <div className="font-medium">{qty}</div>;
      }
    },
    {
      accessorKey: "price",
      header: "Unit Price",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div>{formatted}</div>;
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
              status === "In Stock" ? "secondary" :
              status === "Out of Stock" ? "destructive" :
              status === "Low Stock" ? "default" :
              "outline"
            }
          >
            {status}
          </Badge>
        );
      }
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Elements Repo</h2>
        <p className="text-muted-foreground">Inventory management for equipment, furniture, and decor.</p>
      </div>
      
      <DataTable 
        columns={columns} 
        data={elements} 
        searchKey="name" 
        searchPlaceholder="Search items..." 
      />
    </div>
  );
}
