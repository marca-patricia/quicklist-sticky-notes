import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  locale?: string;
}

export const useSEO = ({
  title = 'QuickList - Lista de Tarefas Simples e Offline',
  description = 'Organize suas tarefas com o QuickList - App PWA bilíngue, offline, com achievements e sincronização automática.',
  keywords = 'lista, tarefas, notas, produtividade, offline, bilíngue, pwa, app, achievements, sincronização',
  image = '/src/assets/quicklist-icon.png',
  url,
  type = 'website',
  locale = 'pt-BR'
}: SEOProps = {}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);

    // Open Graph
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', type, true);
    updateMeta('og:image', `${window.location.origin}${image}`, true);
    updateMeta('og:locale', locale, true);
    
    if (url) {
      updateMeta('og:url', url, true);
    }

    // Twitter Card
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', `${window.location.origin}${image}`);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url || window.location.href;

    // JSON-LD Structured Data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "QuickList",
      "description": description,
      "url": window.location.origin,
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BRL"
      },
      "author": {
        "@type": "Organization",
        "name": "QuickList Team"
      },
      "screenshot": `${window.location.origin}${image}`
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, image, url, type, locale]);
};