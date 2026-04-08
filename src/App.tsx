import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";

// Pages
import EventsLog from "@/pages/events-log";
import EventsHealth from "@/pages/events-health";
import ClientEstimates from "@/pages/client-estimates";
import VendorQuotes from "@/pages/vendor-quotes";
import VendorManagement from "@/pages/vendor-management";
import ElementsRepo from "@/pages/elements-repo";
import Payments from "@/pages/payments";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => { window.location.href = "/events-log"; return null; }} />
      <Route path="/events-log" component={EventsLog} />
      <Route path="/events-health" component={EventsHealth} />
      <Route path="/client-estimates" component={ClientEstimates} />
      <Route path="/vendor-quotes" component={VendorQuotes} />
      <Route path="/vendor-management" component={VendorManagement} />
      <Route path="/elements-repo" component={ElementsRepo} />
      <Route path="/payments" component={Payments} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
