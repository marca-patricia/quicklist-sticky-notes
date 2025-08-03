import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLists } from '@/contexts/ListsContext';
import { OfflineStatus } from '@/components/OfflineStatus';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, FileText, ArrowLeft } from 'lucide-react';
import { ListCard } from '@/components/ListCard';
import { QuickListLogo } from '@/components/QuickListLogo';
import { useLanguage } from '@/contexts/LanguageContext';

export const ListsOverview: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { lists, addList } = useLists();
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateList = () => {
    const title = prompt('Nome da lista:');
    if (title?.trim()) {
      addList(title.trim());
      // Navigate to the newly created list - get the newest one
      setTimeout(() => {
        if (lists.length > 0) {
          const newestList = lists[0]; // Lists are added at the beginning
          navigate(`/list/${newestList.id}`);
        }
      }, 100);
    }
  };

  const filteredLists = lists.filter(list =>
    list.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: '#B8956A',
        backgroundImage: 'url("/lovable-uploads/b28063b1-b719-4516-9218-fe85c0f556c0.png")',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >
      {/* Header estilo post-it com fundo de cortiça */}
      <header className="toolbar-postit p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="button-enhanced flex items-center gap-2 text-amber-900 hover:bg-amber-100/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <QuickListLogo size="sm" />
            <h1 className="text-xl font-bold text-amber-900" style={{ fontFamily: 'Kalam, cursive' }}>
              Minhas Listas
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-amber-800 text-sm font-medium">{lists.length} listas</span>
            <LanguageSwitch />
            <OfflineStatus />
          </div>
        </div>
      </header>

      {/* Toolbar de busca e criação */}
      <div className="p-6">
        <div className="flex gap-4 items-center justify-center mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-700 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar listas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input pl-10"
              style={{ fontFamily: 'Kalam, cursive' }}
            />
          </div>
          
          <Button
            onClick={handleCreateList}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 button-enhanced"
            style={{ fontFamily: 'Kalam, cursive' }}
          >
            <Plus className="w-4 h-4" />
            Nova Lista
          </Button>
        </div>
      </div>

      {/* Grid de mini folhas de caderno */}
      <main className="px-6 pb-8">
        {filteredLists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md">
              <FileText className="w-16 h-16 text-amber-800 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-amber-900 mb-2" style={{ fontFamily: 'Kalam, cursive' }}>
                {searchTerm ? 'Nenhuma lista encontrada' : 'Suas listas aparecerão aqui'}
              </h3>
              <p className="text-amber-800 mb-6" style={{ fontFamily: 'Kalam, cursive' }}>
                {searchTerm ? 'Tente buscar com outros termos' : 'Crie sua primeira lista para começar'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={handleCreateList}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 button-enhanced"
                  style={{ fontFamily: 'Kalam, cursive' }}
                >
                  <Plus className="w-5 h-5" />
                  Criar Primeira Lista
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredLists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};