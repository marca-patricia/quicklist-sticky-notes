
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

console.log('App.tsx: Starting application initialization');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Simple loading component
const SimpleLoading = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #dcfce7 25%, #fce7f3 50%, #e0e7ff 75%, #fed7d7 100%)' }}>
    <div className="text-center">
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando QuickList...</p>
      </div>
    </div>
  </div>
);

// Create a basic home component first
const BasicHome = () => {
  console.log('BasicHome: Component rendering');
  
  return (
    <div className="min-h-screen p-4" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #dcfce7 25%, #fce7f3 50%, #e0e7ff 75%, #fed7d7 100%)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">QuickList</h1>
          <p className="text-gray-600">Sua lista de tarefas simples e eficiente</p>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bem-vindo!</h2>
          <p className="text-gray-600 mb-4">
            A aplicação está carregando. Esta é uma versão básica para verificar se o problema foi resolvido.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Listas</h3>
              <p className="text-purple-600">Organize suas tarefas</p>
            </div>
            
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Notas</h3>
              <p className="text-green-600">Faça anotações rápidas</p>
            </div>
            
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Estatísticas</h3>
              <p className="text-blue-600">Acompanhe seu progresso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  console.log('App: Component rendering');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Suspense fallback={<SimpleLoading />}>
              <main>
                <Routes>
                  <Route path="/" element={<BasicHome />} />
                  <Route path="*" element={<BasicHome />} />
                </Routes>
              </main>
            </Suspense>
            <Toaster />
            <Sonner />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

console.log('App.tsx: Component defined, exporting');

export default App;
