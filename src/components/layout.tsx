import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  CalendarDays, 
  Activity, 
  FileText, 
  FileCheck2, 
  Users, 
  Package, 
  CreditCard 
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: "Events Log", href: "/events-log", icon: CalendarDays },
  { name: "Events Health", href: "/events-health", icon: Activity },
  { name: "Client Estimates", href: "/client-estimates", icon: FileText },
  { name: "Vendor Quotes", href: "/vendor-quotes", icon: FileCheck2 },
  { name: "Vendor Management", href: "/vendor-management", icon: Users },
  { name: "Elements Repo", href: "/elements-repo", icon: Package },
  { name: "Payments", href: "/payments", icon: CreditCard },
];

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 border-r border-border bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground text-lg leading-none">X</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Xarm Solution</span>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className="w-full">
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 pl-64 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-foreground">
            {navItems.find(i => i.href === location)?.name || "Dashboard"}
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-sm text-muted-foreground font-medium">Ops Manager</div>
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm font-bold">
              OM
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
