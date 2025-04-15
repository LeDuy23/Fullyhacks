import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PersonalInfo from "@/pages/PersonalInfo";
import RoomSelection from "@/pages/RoomSelection";
import ItemDetails from "@/pages/ItemDetails";
import ReviewPage from "@/pages/ReviewPage";
import ReviewSubmit from "@/pages/ReviewSubmit";
import AppShell from "@/components/layouts/AppShell";
import { ClaimProvider } from "@/context/ClaimContext";
import { TranslationProvider } from "@/context/TranslationContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/personal-info" component={PersonalInfo} />
      <Route path="/room-selection" component={RoomSelection} />
      <Route path="/item-details/:roomId?" component={ItemDetails} />
      <Route path="/review" component={ReviewPage} />
      <Route path="/template-selection" component={ReviewSubmit} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClaimProvider>
        <TranslationProvider>
          <AppShell>
            <Router />
          </AppShell>
          <Toaster />
        </TranslationProvider>
      </ClaimProvider>
    </QueryClientProvider>
  );
}

export default App;
