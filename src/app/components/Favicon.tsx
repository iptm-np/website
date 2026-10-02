import { useEffect } from 'react';
import faviconImage from '../../imports/DCP_logo-1.webp';

export function Favicon() {
  useEffect(() => {
    const link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement('link');

    link.setAttribute('type', 'image/webp');
    link.setAttribute('rel', 'icon');
    link.setAttribute('href', faviconImage);

    document.head.appendChild(link);
  }, []);

  return null;
}