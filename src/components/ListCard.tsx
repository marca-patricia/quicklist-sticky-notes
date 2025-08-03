import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TodoList } from '@/contexts/ListsContext';
import { useLists } from '@/contexts/ListsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ColorPicker } from '@/components/ColorPicker';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useUndo } from '@/hooks/useUndo';
import { useFeedbackToast } from '@/components/FeedbackToast';
import { Trash2, Archive, ArchiveRestore, CheckCircle } from 'lucide-react';

interface ListCardProps {
  list: TodoList;
  isGridView?: boolean;
}

export const ListCard: React.FC<ListCardProps> = ({ list, isGridView = true }) => {
  const { deleteList, updateList } = useLists();
  const { t } = useLanguage();
  const { addUndoAction } = useUndo();
  const { showSuccess } = useFeedbackToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const completedItems = list.items.filter(item => item.completed);
  const pendingItems = list.items.filter(item => !item.completed);
  const progress = list.items.length > 0 ? (completedItems.length / list.items.length) * 100 : 0;

  const handleDeleteList = () => {
    const listCopy = { ...list };
    deleteList(list.id);
    
    addUndoAction({
      id: `delete-list-${list.id}`,
      action: () => {
        showSuccess(t('listRestored'));
      },
      message: t('listDeleted')
    });
    
    setShowDeleteConfirm(false);
  };

  const handleArchiveToggle = () => {
    const newArchivedState = !list.archived;
    updateList(list.id, { archived: newArchivedState });
    showSuccess(newArchivedState ? t('listArchived') : t('listUnarchived'));
  };

  return (
    <>
      <Link 
        to={`/list/${list.id}`} 
        className="block"
        aria-label={`Abrir lista ${list.title} com ${completedItems.length} de ${list.items.length} tarefas concluídas`}
      >
        <div 
          className="sticky-note hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in relative p-4"
          style={{ backgroundColor: list.color || '#FDF2B2' }}
          role="article"
        >
          {/* Linhas do post-it */}
          <div className="absolute inset-4 pointer-events-none">
            <div className="h-full flex flex-col justify-start">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i} 
                  className="border-b border-amber-300/30 h-4 mb-1"
                  style={{ marginTop: i === 0 ? '20px' : '0' }}
                />
              ))}
            </div>
          </div>
          
          {/* Conteúdo do post-it */}
          <div className="relative z-10">
            {/* Header com título e botões */}
            <div className="flex justify-between items-start mb-3">
              <h3 
                className="font-semibold text-lg text-amber-900 truncate flex-1 leading-5" 
                title={list.title}
                style={{ fontFamily: 'cursive' }}
              >
                {list.title}
              </h3>
              <div className="flex items-center gap-1 ml-2" onClick={(e) => e.preventDefault()}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleArchiveToggle();
                  }}
                  className="text-amber-700 hover:text-amber-900 p-1 h-6 w-6"
                  title={list.archived ? 'Desarquivar' : 'Arquivar'}
                >
                  {list.archived ? <ArchiveRestore className="w-3 h-3" /> : <Archive className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDeleteConfirm(true);
                  }}
                  className="text-red-600 hover:text-red-800 p-1 h-6 w-6"
                  title="Excluir lista"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            {/* Lista de tarefas com linhas */}
            <div className="space-y-1 mb-3">
              {/* Tarefas pendentes */}
              {pendingItems.slice(0, 3).map((item, index) => (
                <div key={item.id} className="flex items-center text-sm text-amber-800 leading-4">
                  <span className="w-3 h-3 border border-amber-600 rounded-sm mr-2 flex-shrink-0" />
                  <span className="truncate" style={{ fontFamily: 'cursive' }}>
                    {item.text}
                  </span>
                </div>
              ))}
              
              {/* Tarefas concluídas - riscadas */}
              {completedItems.slice(0, 2).map((item, index) => (
                <div key={item.id} className="flex items-center text-sm text-amber-700/70 leading-4">
                  <CheckCircle className="w-3 h-3 text-green-600 mr-2 flex-shrink-0" />
                  <span 
                    className="truncate line-through decoration-2 decoration-amber-700" 
                    style={{ fontFamily: 'cursive' }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
              
              {/* Mostrar "mais tarefas" se necessário */}
              {list.items.length > 5 && (
                <div className="text-xs text-amber-600 italic">
                  +{list.items.length - 5} tarefas...
                </div>
              )}
              
              {/* Se não tem tarefas */}
              {list.items.length === 0 && (
                <div className="text-sm text-amber-600 italic leading-4" style={{ fontFamily: 'cursive' }}>
                  Lista vazia
                </div>
              )}
            </div>

            {/* Progresso na parte inferior */}
            <div className="mt-auto pt-2">
              <div className="flex justify-between text-xs text-amber-700 mb-1">
                <span>{completedItems.length}/{list.items.length} concluídas</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-1">
                <div 
                  className="bg-amber-600 rounded-full h-1 transition-all" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Excluir lista?"
        description="Esta ação não pode ser desfeita. A lista e todas as suas tarefas serão removidas permanentemente."
        onConfirm={handleDeleteList}
        confirmText="Excluir"
        variant="destructive"
      />
    </>
  );
};