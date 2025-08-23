
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, X, Edit2 } from 'lucide-react';
import { useLists } from '@/contexts/ListsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

export const ListDetail = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { getListById, addItemToList, toggleItemInList, deleteItemFromList, updateItemInList } = useLists();
  const { t } = useLanguage();
  const [newItemText, setNewItemText] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const list = listId ? getListById(listId) : null;

  if (!list) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lista não encontrada</h1>
          <Button onClick={() => navigate('/')}>
            Voltar para Listas
          </Button>
        </div>
      </div>
    );
  }

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    addItemToList(list.id, newItemText);
    setNewItemText('');
  };

  const handleEditItem = (itemId: string, currentText: string) => {
    setEditingItem(itemId);
    setEditText(currentText);
  };

  const handleSaveEdit = (itemId: string) => {
    if (!editText.trim()) return;
    updateItemInList(list.id, itemId, { text: editText });
    setEditingItem(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditText('');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{list.title}</h1>
            {list.description && (
              <p className="text-muted-foreground mt-1">{list.description}</p>
            )}
          </div>
        </div>

        {/* Add New Item */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Adicionar nova tarefa..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              />
              <Button onClick={handleAddItem}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        <div className="space-y-3">
          {list.items.map((item) => (
            <Card key={item.id} className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleItemInList(list.id, item.id)}
                  />
                  
                  {editingItem === item.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(item.id);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(item.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-between">
                      <span className={`${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {item.text}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditItem(item.id, item.text)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteItemFromList(list.id, item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {list.items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum item ainda. Adicione o primeiro item acima!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
