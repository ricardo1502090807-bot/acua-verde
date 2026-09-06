import type { z } from 'zod';

/**
 * Trae y valida un recurso de WordPress con Zod.
 * IMPORTANTE: usamos "S extends z.ZodTypeAny" + "z.infer<S>" en vez de
 * "ZodType<T>". Con ZodType<T> (un solo parámetro de tipo) TypeScript no
 * logra reconstruir bien los esquemas que usan z.preprocess (como
 * featured_images), y termina infiriendo "unknown" en esos campos.
 * z.infer<S> usa el propio motor de inferencia de Zod, así que el tipo
 * resultante es idéntico al que da schema.parse(json) llamado directo.
 */
export async function fetchWP<S extends z.ZodTypeAny>(
  url: string,
  schema: S
): Promise<z.infer<S>> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`No se pudo obtener ${url} (status ${res.status})`);
  }

  const json = await res.json();
  return schema.parse(json);
}

/**
 * Igual que fetchWP, pero además calcula totalPages para los listados
 * con botón "Cargar más".
 */
export async function fetchWPPaginated<S extends z.ZodTypeAny>(
  url: string,
  schema: S
): Promise<{ items: z.infer<S>; totalPages: number }> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`No se pudo obtener ${url} (status ${res.status})`);
  }

  const json = await res.json();
  const items = schema.parse(json);

  const wpTotalPages = res.headers.get('x-wp-totalpages');
  const totalPages = wpTotalPages
    ? parseInt(wpTotalPages, 10)
    : (Array.isArray(items) && items.length === 9 ? 999 : 1);

  return { items, totalPages };
}