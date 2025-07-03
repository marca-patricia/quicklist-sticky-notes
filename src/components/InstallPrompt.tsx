
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Smartphone, Download } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('quicklist-install-dismissed', 'true');
  };

  // Não mostrar se já foi dispensado
  if (localStorage.getItem('quicklist-install-dismissed')) {
    return null;
  }

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 p-4 bg-gradient-notepad shadow-notepad border-l-4 border-l-notepad-blue max-w-sm mx-auto">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Instalar QuickList</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Adicione o QuickList à sua tela inicial para acesso rápido e uso offline!
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleInstall} className="flex-1 text-xs">
              <Download className="w-3 h-3 mr-1" />
              Instalar
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-xs">
              Depois
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
};
