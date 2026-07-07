import { z } from 'zod';

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

export const BaseWPSchema = z.object({
    id: z.number(),
    slug: z.string(),
    title: z.object({
        rendered: z.string()
    }),
    content: z.object({
        rendered: z.string()
    }),
    featured_images: featuredImagesSchema.optional(),
    acf: z.object({
        subtitle: z.string().optional()
    }).optional()
});

// ESQUEMAS AUXILIARES ACUAVERDE (Para Nosotros)
const acfImageSizesSchema = z.object({
    thumbnail: imageSchema.optional(),
    medium: imageSchema.optional(),
    full: imageSchema.optional()
});

export const NosotrosPageSchema = BaseWPSchema.extend({
    acf_images_urls: z.object({
        imagen_uno: acfImageSizesSchema.optional(),
        imagen_dos: acfImageSizesSchema.optional(),
        imagen_tres: acfImageSizesSchema.optional()
    }).optional()
});

// CATEGORÍAS (Idéntico al curso, ahora incluye id)
export const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string()
});
export const CategoriesSlugSchema = z.array(CategorySchema.pick({
    slug: true
}));
const CategoriesSchema = z.array(CategorySchema);

// NOTICIAS (Como los Posts del curso)
export const PostSchema = BaseWPSchema.omit({
    acf: true
}).extend({
    date: z.string(),
    category_details: CategoriesSchema.optional()
});
export const PostsSchema = z.array(PostSchema);

// INVESTIGACIONES (Corregido: omitimos el campo acf problemático)
export const InvestigacionSchema = BaseWPSchema.omit({
    acf: true
}).extend({
    date: z.string(),
    category_details: CategoriesSchema.optional(),
    // Aquí puedes extender con ".extend({})" si en el futuro le añades campos ACF a las investigaciones
});
export const InvestigacionesSchema = z.array(InvestigacionSchema);

// OPCIONES GLOBALES
export const OpcionesGlobalesSchema = z.object({
    contacto_nombre: z.string().nullable().optional(),
    contacto_email: z.string().nullable().optional(),
    contacto_numero: z.string().nullable().optional(),
    contacto_redes_instagram: z.string().nullable().optional(),
});

export type Post = z.infer<typeof PostSchema>;
export type Investigacion = z.infer<typeof InvestigacionSchema>;
export type FeatureImages = z.infer<typeof featuredImagesSchema>;
export type Category = z.infer<typeof CategorySchema>;