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
        backgroundColor: '#F8F9FA',
        backgroundImage: `
          repeating-linear-gradient(
            transparent,
            transparent 23px,
            #E9ECEF 23px,
            #E9ECEF 24px
          )
        `,
        fontFamily: 'Kalam, cursive'
      }}
    >
      {/* Header estilo caderno */}
      <header className="bg-white border-b-2 border-red-400 p-4 relative">
        {/* Margem vermelha do caderno */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400"></div>
        
        <div className="flex items-center justify-between ml-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="button-enhanced flex items-center gap-2 text-gray-700 hover:bg-gray-100/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <QuickListLogo size="sm" />
            <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Kalam, cursive' }}>
              Listas de Tarefas
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm font-medium">{lists.length} listas</span>
            <LanguageSwitch />
            <OfflineStatus />
          </div>
        </div>
      </header>

      {/* Toolbar de busca e criação */}
      <div className="p-6 ml-8">
        <div className="flex gap-4 items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar listas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-2 border-gray-300 rounded-lg text-gray-700"
              style={{ fontFamily: 'Kalam, cursive' }}
            />
          </div>
          
          <Button
            onClick={handleCreateList}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 button-enhanced"
            style={{ fontFamily: 'Kalam, cursive' }}
          >
            <Plus className="w-4 h-4" />
            Nova Lista
          </Button>
        </div>
      </div>

      {/* Grid de listas */}
      <main className="px-6 pb-8 ml-8">
        {filteredLists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2" style={{ fontFamily: 'Kalam, cursive' }}>
              {searchTerm ? 'Nenhuma lista encontrada' : 'Suas listas aparecerão aqui'}
            </h3>
            <p className="text-gray-500 mb-6" style={{ fontFamily: 'Kalam, cursive' }}>
              {searchTerm ? 'Tente buscar com outros termos' : 'Crie sua primeira lista para começar'}
            </p>
            {!searchTerm && (
              <Button
                onClick={handleCreateList}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 button-enhanced"
                style={{ fontFamily: 'Kalam, cursive' }}
              >
                <Plus className="w-5 h-5" />
                Criar Primeira Lista
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};