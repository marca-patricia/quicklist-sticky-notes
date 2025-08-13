import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, FileText, ShoppingCart, Briefcase, GraduationCap, Heart, Utensils, Car, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const templates = [
  {
    id: 'shopping',
    title: 'Lista de Compras',
    titleEn: 'Shopping List',
    description: 'Organize suas compras do mercado',
    descriptionEn: 'Organize your grocery shopping',
    icon: ShoppingCart,
    color: '#10B981',
    items: ['Frutas e vegetais', 'Produtos de limpeza', 'Carnes e peixes', 'Laticínios']
  },
  {
    id: 'work',
    title: 'Tarefas de Trabalho',
    titleEn: 'Work Tasks',
    description: 'Gerencie suas atividades profissionais',
    descriptionEn: 'Manage your professional activities',
    icon: Briefcase,
    color: '#3B82F6',
    items: ['Revisar relatórios', 'Reunião com equipe', 'Responder emails', 'Preparar apresentação']
  },
  {
    id: 'study',
    title: 'Plano de Estudos',
    titleEn: 'Study Plan',
    description: 'Organize sua rotina de estudos',
    descriptionEn: 'Organize your study routine',
    icon: GraduationCap,
    color: '#8B5CF6',
    items: ['Revisar anotações', 'Fazer exercícios', 'Ler capítulo 5', 'Preparar para prova']
  },
  {
    id: 'health',
    title: 'Cuidados Pessoais',
    titleEn: 'Personal Care',
    description: 'Mantenha seus hábitos saudáveis',
    descriptionEn: 'Maintain your healthy habits',
    icon: Heart,
    color: '#EF4444',
    items: ['Beber 2L de água', 'Exercitar 30 min', 'Tomar vitaminas', 'Dormir 8 horas']
  },
  {
    id: 'meal',
    title: 'Planejamento de Refeições',
    titleEn: 'Meal Planning',
    description: 'Planeje suas refeições da semana',
    descriptionEn: 'Plan your weekly meals',
    icon: Utensils,
    color: '#F59E0B',
    items: ['Café da manhã', 'Almoço', 'Lanche da tarde', 'Jantar']
  },
  {
    id: 'travel',
    title: 'Lista de Viagem',
    titleEn: 'Travel List',
    description: 'Não esqueça nada na sua viagem',
    descriptionEn: 'Don\'t forget anything on your trip',
    icon: Car,
    color: '#06B6D4',
    items: ['Documentos', 'Roupas', 'Medicamentos', 'Eletrônicos']
  },
  {
    id: 'home',
    title: 'Tarefas Domésticas',
    titleEn: 'Household Tasks',
    description: 'Organize as tarefas de casa',
    descriptionEn: 'Organize household chores',
    icon: Home,
    color: '#84CC16',
    items: ['Limpar cozinha', 'Lavar roupas', 'Aspirar casa', 'Organizar armários']
  },
  {
    id: 'goals',
    title: 'Metas Pessoais',
    titleEn: 'Personal Goals',
    description: 'Defina e acompanhe suas metas',
    descriptionEn: 'Set and track your goals',
    icon: FileText,
    color: '#F97316',
    items: ['Meta 1', 'Meta 2', 'Meta 3', 'Meta 4']
  }
];

export const TemplatesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { addList, addItemToList } = useLists();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleUseTemplate = (template: typeof templates[0]) => {
    const title = language === 'pt' ? template.title : template.titleEn;
    const description = language === 'pt' ? template.description : template.descriptionEn;

    addList(title, description, template.color);
    
    // Get the newly created list (it's added to the beginning of the array)
    const newListId = Date.now().toString(); // This matches the ID generation in addList
    
    // Add items to the newly created list after a small delay to ensure list is created
    setTimeout(() => {
      template.items.forEach(itemText => {
        addItemToList(newListId, itemText);
      });
    }, 100);
    
    toast({
      title: t('templateApplied'),
      description: language === 'pt' 
        ? `Lista "${title}" criada com sucesso`
        : `List "${title}" created successfully`,
    });
    
    // Navigate to the main page to see the new list
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'pt' ? 'Voltar' : 'Back'}
              </Button>
              <h1 className="text-2xl font-bold">{t('templates')}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-muted-foreground text-lg">
            {language === 'pt' 
              ? 'Escolha um modelo para começar rapidamente com listas pré-configuradas'
              : 'Choose a template to quickly start with pre-configured lists'
            }
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => {
            const Icon = template.icon;
            const isSelected = selectedTemplate === template.id;
            
            return (
              <div
                key={template.id}
                className={`group relative bg-card rounded-xl p-6 border transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:border-primary/20'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                {/* Template Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="p-3 rounded-lg shrink-0"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    <Icon 
                      className="w-6 h-6" 
                      style={{ color: template.color }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-lg mb-1 text-foreground">
                      {language === 'pt' ? template.title : template.titleEn}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'pt' ? template.description : template.descriptionEn}
                    </p>
                  </div>
                </div>

                {/* Preview Items */}
                <div className="space-y-2 mb-4">
                  {template.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-4 h-4 rounded border-2 border-muted-foreground/30"></div>
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                  {template.items.length > 3 && (
                    <div className="text-xs text-muted-foreground/70 ml-7">
                      +{template.items.length - 3} {language === 'pt' ? 'mais itens' : 'more items'}
                    </div>
                  )}
                </div>

                {/* Use Template Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(template);
                  }}
                  className="w-full group-hover:shadow-md transition-all"
                  style={{ backgroundColor: template.color }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {language === 'pt' ? 'Usar Template' : 'Use Template'}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Custom Template Section */}
        <div className="mt-12 text-center">
          <div className="bg-muted/50 rounded-xl p-8">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              {t('didntFindLooking')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === 'pt' 
                ? 'Crie sua própria lista personalizada do zero'
                : 'Create your own custom list from scratch'
              }
            </p>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
            >
              {language === 'pt' ? 'Criar Lista Personalizada' : 'Create Custom List'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};