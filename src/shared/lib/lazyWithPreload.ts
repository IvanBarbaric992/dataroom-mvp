import { type ComponentType, lazy, type LazyExoticComponent } from 'react';

export interface PreloadableComponent<T = Record<string, never>>
  extends LazyExoticComponent<ComponentType<T>> {
  preload: () => void;
}

const importCache = new Map<string, Promise<{ default: ComponentType<unknown> }>>();

export function lazyWithPreload<T = Record<string, never>>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  key?: string,
): PreloadableComponent<T> {
  const cacheKey = key ?? importFn.toString();

  const getLazyImport = () => {
    if (!importCache.has(cacheKey)) {
      importCache.set(
        cacheKey,
        importFn().catch((error: unknown) => {
          importCache.delete(cacheKey);
          throw error;
        }) as Promise<{ default: ComponentType<unknown> }>,
      );
    }
    const cached = importCache.get(cacheKey);
    if (!cached) {
      throw new Error('Import cache error');
    }
    return cached as Promise<{ default: ComponentType<T> }>;
  };

  const LazyComponent = lazy(() => getLazyImport()) as PreloadableComponent<T>;
  LazyComponent.preload = () => void getLazyImport();

  return LazyComponent;
}
