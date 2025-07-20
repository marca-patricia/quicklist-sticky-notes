
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export const ListTemplates: React.FC = () => {
  return (
    <Button variant="outline" size="sm">
      <FileText className="w-4 h-4 mr-2" />
      <span className="hidden sm:inline">Modelos</span>
    </Button>
  );
};
