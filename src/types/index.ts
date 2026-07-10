import { z } from 'zod';

// 1. ESQUEMAS BASE DE IMÁGENES
const imageSchema = z.object({
    url: z.string(),
    width: z.number(),
    height: z.number()
});

const featuredImagesSchema = z.object({
    thumbnail: imageSchema.optional(),
    medium: imageSchema.optional(),
    medium_large: imageSchema.optional(),
    large: imageSchema.optional(),
    full: imageSchema.optional()
});

// (La sección 2 fue eliminada completamente para no quemar imágenes en el código)

// 3. ESQUEMA BASE DE WORDPRESS (Actualizado para Misión, Visión y fallback nulo de imágenes)
export const BaseWPSchema = z.object({
    id: z.number(),
    slug: z.string(),
    title: z.object({
        rendered: z.string()
    }),
    content: z.object({
        rendered: z.string()
    }),
    featured_images: z.preprocess(
        (val) => {
            // Si el backend devuelve false o no manda nada, pasamos un null seguro
            if (typeof val === "boolean" || !val) {
                return null;
            }
            return val;
        },
        featuredImagesSchema.nullable() // Ahora Zod sabe que es legal recibir un null
    ).optional(),
    acf: z.object({
        subtitle: z.string().optional(),
        mision: z.string().optional(),
        vision: z.string().optional()
    }).optional()
});

// 4. ESQUEMAS AUXILIARES ACUAVERDE (Para Nosotros)
export const NosotrosPageSchema = BaseWPSchema.extend({
    acf_images_urls: z.preprocess(
        (val) => {
            // Si WP manda un array vacío [] (porque no hay ninguna imagen) o false,
            // lo transformamos en un objeto vacío {} para que el validador no colapse.
            if (Array.isArray(val) && val.length === 0) return {};
            if (!val || typeof val === "boolean") return {};
            return val;
        },
        z.object({
            imagen_uno: featuredImagesSchema.optional(),
            imagen_dos: featuredImagesSchema.optional(),
            imagen_tres: featuredImagesSchema.optional()
        })
    ).optional()
});

// 5. CATEGORÍAS
export const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string()
});
export const CategoriesSlugSchema = z.array(CategorySchema.pick({
    slug: true
}));
const CategoriesSchema = z.array(CategorySchema);

// === ESQUEMA DE AUTOR CUSTOM ===
const AutorCustomSchema = z.object({
    nombre: z.string(),
    imagen: featuredImagesSchema.nullable().optional() 
});

// 6. NOTICIAS
export const PostSchema = BaseWPSchema.omit({
    acf: true
}).extend({
    date: z.string(),
    category_details: CategoriesSchema.optional(),
    autor_custom: AutorCustomSchema.optional()
});
export const PostsSchema = z.array(PostSchema);

// 7. INVESTIGACIONES
export const InvestigacionSchema = BaseWPSchema.omit({
    acf: true
}).extend({
    date: z.string(),
    category_details: CategoriesSchema.optional(),
    autor_custom: AutorCustomSchema.optional()
});
export const InvestigacionesSchema = z.array(InvestigacionSchema);

// 8. OPCIONES GLOBALES
export const OpcionesGlobalesSchema = z.object({
    contacto_nombre: z.string().nullable().optional(),
    contacto_email: z.string().nullable().optional(),
    contacto_numero: z.string().nullable().optional(),
    contacto_redes_instagram: z.string().nullable().optional(),
    contacto_redes_x: z.string().nullable().optional(),
    contacto_redes_facebook: z.string().nullable().optional(),
});

// 9. EXPORTACIÓN DE TIPOS
export type Post = z.infer<typeof PostSchema>;
export type Investigacion = z.infer<typeof InvestigacionSchema>;
export type FeatureImages = z.infer<typeof featuredImagesSchema>;
export type Category = z.infer<typeof CategorySchema>;