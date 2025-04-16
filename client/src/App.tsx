import { Switch, Route, useLocation } from "wouter";
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
import LandingPage from "@/pages/LandingPage";
import AboutPage from "@/pages/AboutPage";
import AppShell from "@/components/layouts/AppShell";
import { ClaimProvider } from "@/context/ClaimContext";
import { TranslationProvider } from "@/context/TranslationContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/home" component={Home} />
      <Route path="/personal-info" component={PersonalInfo} />
      <Route path="/room-selection" component={RoomSelection} />
      <Route path="/item-details/:roomId?" component={ItemDetails} />
      <Route path="/review" component={ReviewPage} />
      <Route path="/template-selection" component={ReviewSubmit} />
      <Route component={NotFound} />
    </Switch>
  );
}

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  // Get the current location (wouter useLocation returns [path, navigate])
  const [path] = useLocation();
  
  // Check if current route is landing page or about page
  const isFullWidthPage = path === "/" || path === "/about";
  
  // If it's a full width page, don't wrap with AppShell
  if (isFullWidthPage) {
    return <>{children}</>;
  }
  
  // Otherwise use the AppShell layout
  return <AppShell>{children}</AppShell>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClaimProvider>
        <TranslationProvider>
          <PageWrapper>
            <Router />
          </PageWrapper>
          <Toaster />
        </TranslationProvider>
      </ClaimProvider>
    </QueryClientProvider>
  );
}

export default App;
