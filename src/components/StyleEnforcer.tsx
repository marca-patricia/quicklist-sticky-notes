import React, { useEffect } from 'react';

// Componente para forçar atualização de estilos
export const StyleEnforcer: React.FC = () => {
  useEffect(() => {
    // Força aplicação imediata dos estilos
    const enforceStyles = () => {
      // 1. Força refresh completo do CSS
      const timestamp = Date.now();
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      links.forEach(link => {
        const href = (link as HTMLLinkElement).href.split('?')[0];
        (link as HTMLLinkElement).href = `${href}?cache=${timestamp}`;
      });

      // 2. Aplica estilos diretamente no body
      const body = document.body;
      body.style.backgroundColor = '#B8956A';
      body.style.backgroundImage = "url('/lovable-uploads/be6033c7-c1b4-427d-8e5b-51bbf648618f.png')";
      body.style.backgroundSize = 'cover';
      body.style.backgroundAttachment = window.innerWidth <= 768 ? 'scroll' : 'fixed';
      body.style.backgroundRepeat = 'no-repeat';
      body.style.backgroundPosition = 'center';

      // 3. Força atualização de todos os elementos
      setTimeout(() => {
        // Remove classes antigas que podem estar causando conflito
        document.querySelectorAll('*').forEach(el => {
          el.classList.remove('bg-background');
        });

        // Aplica classes corretas nos sticky notes
        document.querySelectorAll('[class*="w-40"]').forEach(note => {
          const element = note as HTMLElement;
          element.classList.add('sticky-note');
          if (window.innerWidth <= 768) {
            element.classList.add('sticky-note-mobile');
          }
        });

        // Força grid layout
        document.querySelectorAll('[style*="grid-template-columns"]').forEach(grid => {
          const element = grid as HTMLElement;
          element.classList.add('notes-grid');
          if (window.innerWidth <= 768) {
            element.classList.add('notes-grid-mobile');
          }
        });
      }, 200);
    };

    // Executa múltiplas vezes para garantir
    enforceStyles();
    setTimeout(enforceStyles, 500);
    setTimeout(enforceStyles, 1000);
    setTimeout(enforceStyles, 2000);

    // Listeners para eventos
    window.addEventListener('load', enforceStyles);
    window.addEventListener('resize', enforceStyles);
    window.addEventListener('focus', enforceStyles);

    return () => {
      window.removeEventListener('load', enforceStyles);
      window.removeEventListener('resize', enforceStyles);
      window.removeEventListener('focus', enforceStyles);
    };
  }, []);

  // Inject CSS directly to override cache
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'force-styles';
    style.innerHTML = `
      body {
        background-color: #B8956A !important;
        background-image: url('/lovable-uploads/be6033c7-c1b4-427d-8e5b-51bbf648618f.png') !important;
        background-size: cover !important;
        background-attachment: ${window.innerWidth <= 768 ? 'scroll' : 'fixed'} !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
      }
      
      .sticky-note {
        width: 160px !important;
        height: 160px !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        border-radius: 2px !important;
      }
      
      .notes-grid {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, 160px) !important;
        gap: 16px !important;
        padding: 20px !important;
      }
      
      @media (max-width: 768px) {
        body {
          background-attachment: scroll !important;
        }
        .sticky-note-mobile {
          width: 140px !important;
          height: 140px !important;
        }
        .notes-grid-mobile {
          grid-template-columns: repeat(auto-fill, 140px) !important;
          gap: 12px !important;
          justify-content: center !important;
        }
      }
    `;
    
    // Remove estilo anterior se existir
    const existingStyle = document.getElementById('force-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById('force-styles');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, []);

  return null;
};