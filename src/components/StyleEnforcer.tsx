import React, { useEffect } from 'react';

// Componente simplificado para aplicar estilos sem interferir no carregamento
export const StyleEnforcer: React.FC = () => {
  useEffect(() => {
    // Aplica estilos uma única vez e suavemente
    const applyStyles = () => {
      // Apenas aplica background se necessário
      if (!document.body.style.backgroundImage.includes('lovable-uploads')) {
        document.body.style.backgroundColor = '#B8956A';
        document.body.style.backgroundImage = "url('/lovable-uploads/be6033c7-c1b4-427d-8e5b-51bbf648618f.png')";
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = window.innerWidth <= 768 ? 'scroll' : 'fixed';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
      }
    };

    // Executa uma vez apenas, sem múltiplas tentativas
    const timer = setTimeout(applyStyles, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
};