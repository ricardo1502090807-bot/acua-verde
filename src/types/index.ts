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

// 2. CONFIGURACIÓN DE IMAGEN POR DEFECTO
const DEFAULT_IMAGE_DATA = {
    url: "/image_default.png", // <-- Cambia esto por la ruta real de tu imagen en public/
    width: 1200,
    height: 800
};

const DEFAULT_FEATURED_IMAGES = {
    full: DEFAULT_IMAGE_DATA,
    medium: DEFAULT_IMAGE_DATA,
    thumbnail: { ...DEFAULT_IMAGE_DATA, width: 150, height: 150 }
};

// 3. ESQUEMA BASE DE WORDPRESS (Con la corrección de booleanos)
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
            // Interceptamos si WordPress envía false o null al no tener imagen destacada
            if (typeof val === "boolean" || !val) {
                return DEFAULT_FEATURED_IMAGES;
            }
            return val;
        },
        featuredImagesSchema
    ).optional(),
    acf: z.object({
        subtitle: z.string().optional()
    }).optional()
});

// 4. ESQUEMAS AUXILIARES ACUAVERDE (Para Nosotros)
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

// === NUEVO: ESQUEMA DE AUTOR CUSTOM ===
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
    autor_custom: AutorCustomSchema.optional() // <-- Añadido aquí
});
export const PostsSchema = z.array(PostSchema);

// 7. INVESTIGACIONES
export const InvestigacionSchema = BaseWPSchema.omit({
    acf: true
}).extend({
    date: z.string(),
    category_details: CategoriesSchema.optional(),
    autor_custom: AutorCustomSchema.optional() // <-- Añadido aquí
});
export const InvestigacionesSchema = z.array(InvestigacionSchema);

// 8. OPCIONES GLOBALES
export const OpcionesGlobalesSchema = z.object({
    contacto_nombre: z.string().nullable().optional(),
    contacto_email: z.string().nullable().optional(),
    contacto_numero: z.string().nullable().optional(),
    contacto_redes_instagram: z.string().nullable().optional(),
});

// 9. EXPORTACIÓN DE TIPOS
export type Post = z.infer<typeof PostSchema>;
export type Investigacion = z.infer<typeof InvestigacionSchema>;
export type FeatureImages = z.infer<typeof featuredImagesSchema>;
export type Category = z.infer<typeof CategorySchema>;