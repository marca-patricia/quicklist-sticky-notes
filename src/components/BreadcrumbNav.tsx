import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ComponentType<any>;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
  showBackButton?: boolean;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ 
  items, 
  showBackButton = true 
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const getDefaultBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const breadcrumbs: BreadcrumbItem[] = [
      { label: t('nav.home'), path: '/', icon: Home }
    ];

    if (path.startsWith('/sticky-notes')) {
      breadcrumbs.push({ label: t('nav.notes'), path: '/sticky-notes' });
    } else if (path.startsWith('/templates')) {
      breadcrumbs.push({ label: t('nav.templates'), path: '/templates' });
    } else if (path.startsWith('/statistics')) {
      breadcrumbs.push({ label: t('nav.statistics'), path: '/statistics' });
    } else if (path.startsWith('/achievements')) {
      breadcrumbs.push({ label: t('nav.achievements'), path: '/achievements' });
    } else if (path.startsWith('/list/')) {
      breadcrumbs.push({ label: t('nav.listDetail'), path: path });
    }

    return breadcrumbs;
  };

  const breadcrumbItems = items || getDefaultBreadcrumbs();
  const isHomePage = location.pathname === '/';

  if (isHomePage && !items) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 animate-fade-in">
      {showBackButton && !isHomePage && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-2 hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('nav.back')}
        </Button>
      )}
      
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const IconComponent = item.icon;
        
        return (
          <React.Fragment key={item.path}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            )}
            
            <button
              onClick={() => !isLast && navigate(item.path)}
              className={`flex items-center gap-1 transition-colors hover:text-foreground ${
                isLast 
                  ? 'text-foreground font-medium cursor-default' 
                  : 'hover:text-foreground cursor-pointer'
              }`}
              disabled={isLast}
            >
              {IconComponent && (
                <IconComponent className="w-4 h-4" />
              )}
              {item.label}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};