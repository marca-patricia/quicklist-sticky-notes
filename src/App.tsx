import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <main>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={
                  <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-2">QuickList</h1>
                      <p className="text-muted-foreground">Aplicação carregada com sucesso!</p>
                    </div>
                  </div>
                } />
              </Routes>
            </main>
            <Toaster />
            <Sonner />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
};

export default App;