import { useEffect, useState } from 'react';

export default function useRuntimeContent(path, fallbackContent) {
  const [content, setContent] = useState(fallbackContent);

  useEffect(() => {
    let isCancelled = false;

    const loadContent = async () => {
      try {
        const response = await fetch(path, {
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          return;
        }

        const nextContent = await response.json();

        if (!isCancelled && nextContent && typeof nextContent === 'object') {
          setContent(nextContent);
        }
      } catch {
        // Keep fallback content when runtime JSON is not available.
      }
    };

    loadContent();

    return () => {
      isCancelled = true;
    };
  }, [path]);

  return content;
}
