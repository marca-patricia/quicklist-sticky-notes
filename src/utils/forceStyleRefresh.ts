// Utilitário para forçar atualização de estilos e garantir aplicação correta
export const forceStyleRefresh = () => {
  // Força refresh dos estilos CSS
  const timestamp = Date.now();
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  
  links.forEach(link => {
    const href = (link as HTMLLinkElement).href.split('?')[0];
    (link as HTMLLinkElement).href = `${href}?v=${timestamp}`;
  });

  // Aplica estilos mobile específicos se necessário
  if (window.innerWidth <= 768) {
    // Background scroll para mobile
    document.body.style.backgroundAttachment = 'scroll';
    
    // Força aplicação das classes CSS personalizadas
    setTimeout(() => {
      const grids = document.querySelectorAll('.notes-grid');
      grids.forEach(grid => {
        (grid as HTMLElement).classList.add('notes-grid-mobile');
      });

      const notes = document.querySelectorAll('.sticky-note');
      notes.forEach(note => {
        (note as HTMLElement).classList.add('sticky-note-mobile');
      });
    }, 100);
  }
};

// Auto-executa quando o módulo é carregado
if (typeof window !== 'undefined') {
  // Executa imediatamente
  forceStyleRefresh();
  
  // Executa em eventos importantes
  window.addEventListener('load', forceStyleRefresh);
  window.addEventListener('resize', forceStyleRefresh);
  window.addEventListener('orientationchange', forceStyleRefresh);
}