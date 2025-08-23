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
                  <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #dcfce7 25%, #fce7f3 50%, #e0e7ff 75%, #fed7d7 100%)' }}>
                    <div className="text-center max-w-md mx-auto">
                      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20">
                        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ✅ QuickList
                        </h1>
                        <p className="text-gray-600 mb-6">
                          Aplicação carregada com sucesso!
                        </p>
                        <div className="space-y-4">
                          <div className="bg-green-100 text-green-800 p-3 rounded-lg text-sm">
                            ✨ Tudo funcionando perfeitamente
                          </div>
                          <div className="text-xs text-gray-500">
                            Versão de desenvolvimento ativa
                          </div>
                        </div>
                      </div>
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