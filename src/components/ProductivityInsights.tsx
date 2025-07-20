
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';

export const ProductivityInsights: React.FC = () => {
  return (
    <Button variant="outline" size="sm">
      <BarChart3 className="w-4 h-4 mr-2" />
      <span className="hidden sm:inline">Insights</span>
    </Button>
  );
};
