import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';
import { useToast } from '@/hooks/use-toast';
import { FileText, Briefcase, Home, Plane, ShoppingCart, Dumbbell, BookOpen, Heart } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  items: string[];
  categories?: Array<{ name: string; color: string }>;
}

const templates: Template[] = [
  {
    id: 'work-daily',
    name: 'Rotina de Trabalho',
    description: 'Lista para organizar seu dia de trabalho',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'border-l-blue-500',
    items: [
      'Verificar e-mails',
      'Revisar agenda do dia',
      'Reunião da equipe',
      'Trabalhar no projeto principal',
      'Responder mensagens pendentes',
      'Planejar tarefas de amanhã'
    ],
    categories: [
      { name: 'Urgente', color: 'bg-red-500' },
      { name: 'Reuniões', color: 'bg-blue-500' },
      { name: 'Projetos', color: 'bg-green-500' }
    ]
  },
  {
    id: 'home-cleaning',
    name: 'Limpeza da Casa',
    description: 'Organize as tarefas domésticas',
    icon: <Home className="w-6 h-6" />,
    color: 'border-l-green-500',
    items: [
      'Aspirar os quartos',
      'Limpar banheiros',
      'Organizar sala de estar',
      'Lavar louça',
      'Fazer as camas',
      'Tirar o lixo',
      'Limpar espelhos'
    ],
    categories: [
      { name: 'Semanal', color: 'bg-green-500' },
      { name: 'Diário', color: 'bg-blue-500' }
    ]
  },
  {
    id: 'shopping-list',
    name: 'Lista de Compras',
    description: 'Não esqueça nada no supermercado',
    icon: <ShoppingCart className="w-6 h-6" />,
    color: 'border-l-orange-500',
    items: [
      'Pão',
      'Leite',
      'Ovos',
      'Frutas',
      'Verduras',
      'Carne',
      'Produtos de limpeza',
      'Papel higiênico'
    ],
    categories: [
      { name: 'Padaria', color: 'bg-yellow-500' },
      { name: 'Laticínios', color: 'bg-blue-500' },
      { name: 'Carnes', color: 'bg-red-500' },
      { name: 'Hortifruti', color: 'bg-green-500' }
    ]
  },
  {
    id: 'travel-packing',
    name: 'Mala de Viagem',
    description: 'Checklist para não esquecer nada',
    icon: <Plane className="w-6 h-6" />,
    color: 'border-l-purple-500',
    items: [
      'Documentos e passaporte',
      'Roupas íntimas',
      'Camisetas',
      'Calças/shorts',
      'Sapatos confortáveis',
      'Produtos de higiene',
      'Carregador do celular',
      'Medicamentos',
      'Óculos de sol'
    ],
    categories: [
      { name: 'Documentos', color: 'bg-red-500' },
      { name: 'Roupas', color: 'bg-blue-500' },
      { name: 'Eletrônicos', color: 'bg-purple-500' }
    ]
  },
  {
    id: 'workout-routine',
    name: 'Treino Semanal',
    description: 'Organize sua rotina de exercícios',
    icon: <Dumbbell className="w-6 h-6" />,
    color: 'border-l-red-500',
    items: [
      'Aquecimento (10 min)',
      'Treino de força (30 min)',
      'Cardio (20 min)',
      'Alongamento (10 min)',
      'Beber água',
      'Registrar progresso'
    ],
    categories: [
      { name: 'Força', color: 'bg-red-500' },
      { name: 'Cardio', color: 'bg-orange-500' },
      { name: 'Flexibilidade', color: 'bg-green-500' }
    ]
  },
  {
    id: 'study-plan',
    name: 'Plano de Estudos',
    description: 'Organize sua rotina de aprendizado',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'border-l-indigo-500',
    items: [
      'Revisar anotações da aula anterior',
      'Ler capítulo do livro',
      'Fazer exercícios práticos',
      'Assistir vídeo-aula',
      'Criar resumo',
      'Fazer flashcards',
      'Praticar problemas'
    ],
    categories: [
      { name: 'Teoria', color: 'bg-blue-500' },
      { name: 'Prática', color: 'bg-green-500' },
      { name: 'Revisão', color: 'bg-purple-500' }
    ]
  },
  {
    id: 'health-wellness',
    name: 'Saúde e Bem-estar',
    description: 'Cuide da sua saúde física e mental',
    icon: <Heart className="w-6 h-6" />,
    color: 'border-l-pink-500',
    items: [
      'Beber 8 copos de água',
      'Tomar vitaminas',
      'Meditar (10 min)',
      'Caminhar 30 minutos',
      'Dormir 8 horas',
      'Comer frutas e vegetais',
      'Fazer pausa da tela'
    ],
    categories: [
      { name: 'Físico', color: 'bg-green-500' },
      { name: 'Mental', color: 'bg-blue-500' },
      { name: 'Nutricional', color: 'bg-orange-500' }
    ]
  }
];

export const ListTemplates: React.FC = () => {
  const { t } = useLanguage();
  const { addList, addCategoryToList } = useLists();
  const { toast } = useToast();

  const createListFromTemplate = (template: Template) => {
    addList(template.name, template.description);
    
    if (template.categories && template.categories.length > 0) {
      // Get the newly created list
      setTimeout(() => {
        const lists = JSON.parse(localStorage.getItem('quicklist-lists') || '[]');
        const newList = lists[0]; // The most recently added list
        if (newList) {
          template.categories!.forEach(category => {
            addCategoryToList(newList.id, {
              name: category.name,
              color: category.color,
              icon: '🏷️' // Default icon for template categories
            });
          });
        }
      }, 100);
    }
    
    toast({
      description: `Lista "${template.name}" criada com sucesso!`,
      duration: 2000,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Templates</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Templates de Listas
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(template => (
            <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-primary">
                  {template.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.description}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Exemplo de tarefas:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {template.items.slice(0, 4).map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                      {item}
                    </li>
                  ))}
                  {template.items.length > 4 && (
                    <li className="text-xs">+ mais {template.items.length - 4} tarefas</li>
                  )}
                </ul>
              </div>
              
              {template.categories && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Categorias incluídas:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.categories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <Button 
                onClick={() => createListFromTemplate(template)}
                className="w-full"
                size="sm"
              >
                Usar Template
              </Button>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Dica:</strong> Os templates criam a estrutura da lista com categorias. 
            Você pode adicionar, remover ou modificar as tarefas conforme suas necessidades.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
