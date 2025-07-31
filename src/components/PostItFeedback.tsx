import React from 'react';
import { CheckCircle } from 'lucide-react';

interface PostItFeedbackProps {
  show: boolean;
  message: string;
}

export const PostItFeedback: React.FC<PostItFeedbackProps> = ({ show, message }) => {
  if (!show) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-postit flex items-center gap-2">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};