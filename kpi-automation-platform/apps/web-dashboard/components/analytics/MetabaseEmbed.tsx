'use client';

import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface MetabaseEmbedProps {
  url: string;
  title?: string;
  height?: string;
  className?: string;
}

/**
 * MetabaseEmbed Component
 *
 * Embeds a Metabase dashboard or question using JWT-signed URL
 * The URL should be generated server-side using @kpi/integrations-metabase
 *
 * @example
 * ```tsx
 * <MetabaseEmbed
 *   url={embedUrl}
 *   title="Funnel Analysis"
 *   height="600px"
 * />
 * ```
 */
export function MetabaseEmbed({ url, title, height = '600px', className = '' }: MetabaseEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    let timeoutId: NodeJS.Timeout;

    const handleLoad = () => {
      clearTimeout(timeoutId);
    };

    iframe.addEventListener('load', handleLoad);

    // Set a timeout to show error if iframe doesn't load
    timeoutId = setTimeout(() => {
      console.error('Metabase iframe failed to load within timeout');
    }, 30000);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      clearTimeout(timeoutId);
    };
  }, [url]);

  return (
    <div className={`relative w-full ${className}`} style={{ height }}>
      <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
      <iframe
        ref={iframeRef}
        src={url}
        title={title || 'Metabase Dashboard'}
        className="absolute inset-0 w-full h-full border-0 rounded-lg"
        allowTransparency
        style={{ backgroundColor: 'transparent' }}
      />
    </div>
  );
}
