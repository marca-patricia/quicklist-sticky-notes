
import React, { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Wifi, WifiOff, Download, Upload, HardDrive, RefreshCw } from 'lucide-react';

export const OfflineStatus: React.FC = () => {
  const { 
    isOnline, 
    isSyncing, 
    pendingActions, 
    syncPendingActions, 
    exportData, 
    importData, 
    getStorageUsage 
  } = useOfflineSync();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storageInfo = getStorageUsage();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importData(file);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-orange-600" />
          )}
          {pendingActions > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingActions}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5 text-green-600" />
                Status: Online
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-orange-600" />
                Status: Offline
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Connection Status */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Conexão</span>
              <span className={`text-sm font-medium ${
                isOnline ? 'text-green-600' : 'text-orange-600'
              }`}>
                {isOnline ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            
            {pendingActions > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Alterações pendentes</span>
                  <span className="font-medium">{pendingActions}</span>
                </div>
                {isOnline && (
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    onClick={syncPendingActions}
                    disabled={isSyncing}
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sincronizando...
                      </>
                    ) : (
                      'Sincronizar Agora'
                    )}
                  </Button>
                )}
              </div>
            )}
          </Card>

          {/* Storage Usage */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-4 h-4" />
              <span className="text-sm font-medium">Armazenamento Local</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Usado</span>
                <span>{storageInfo.usedMB} MB</span>
              </div>
              
              <Progress 
                value={(parseFloat(storageInfo.usedMB) / 5) * 100} 
                className="h-2"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Disponível: {storageInfo.availableMB} MB</span>
                <span>Total: 5.00 MB</span>
              </div>
            </div>
          </Card>

          {/* Backup & Restore */}
          <Card className="p-4">
            <h3 className="text-sm font-medium mb-3">Backup & Restauração</h3>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={exportData}
              >
                <Download className="w-4 h-4 mr-2" />
                Fazer Backup dos Dados
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleImportClick}
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar Backup
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </Card>

          {/* Offline Features */}
          <Card className="p-4 bg-blue-50 dark:bg-blue-950/20">
            <h3 className="text-sm font-medium mb-2 text-blue-700 dark:text-blue-300">
              Recursos Offline
            </h3>
            <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <li>✓ Criar e editar listas</li>
              <li>✓ Adicionar e completar tarefas</li>
              <li>✓ Usar categorias e filtros</li>
              <li>✓ Ver conquistas e estatísticas</li>
              <li>✓ Sincronização automática quando online</li>
            </ul>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
