
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ListsProvider } from "@/contexts/ListsContext";
import { ListsOverview } from "./pages/ListsOverview";
import { ListDetail } from "./pages/ListDetail";
import { ListWidget } from "./components/ListWidget";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Check if this is a widget view
  const urlParams = new URLSearchParams(window.location.search);
  const listId = urlParams.get('list');
  const isWidget = urlParams.get('widget') === 'true';

  if (isWidget && listId) {
    return (
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <ListsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <ListWidget listId={listId} />
            </TooltipProvider>
          </ListsProvider>
        </LanguageProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ListsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<ListsOverview />} />
                <Route path="/list/:listId" element={<ListDetail />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ListsProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
