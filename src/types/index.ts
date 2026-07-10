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

// 3. ESQUEMA BASE DE WORDPRESS (Actualizado para Misión y Visión)
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
            if (typeof val === "boolean" || !val) {
                return DEFAULT_FEATURED_IMAGES;
            }
            return val;
        },
        featuredImagesSchema
    ).optional(),
    acf: z.object({
        subtitle: z.string().optional(),
        mision: z.string().optional(), // <-- Añadido
        vision: z.string().optional()  // <-- Añadido
    }).optional()
});

// 4. ESQUEMAS AUXILIARES ACUAVERDE (Para Nosotros)
// Eliminamos el acfImageSizesSchema restrictivo y reutilizamos featuredImagesSchema que ya tiene todos los tamaños

export const NosotrosPageSchema = BaseWPSchema.extend({
    acf_images_urls: z.object({
        imagen_uno: featuredImagesSchema.optional(),
        imagen_dos: featuredImagesSchema.optional(),
        imagen_tres: featuredImagesSchema.optional()
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

// 8. OPCIONES GLOBALES (Actualizado para Redes Completas)
export const OpcionesGlobalesSchema = z.object({
    contacto_nombre: z.string().nullable().optional(),
    contacto_email: z.string().nullable().optional(),
    contacto_numero: z.string().nullable().optional(),
    contacto_redes_instagram: z.string().nullable().optional(),
    contacto_redes_x: z.string().nullable().optional(),        // <-- Añadido
    contacto_redes_facebook: z.string().nullable().optional(), // <-- Añadido
});

// 9. EXPORTACIÓN DE TIPOS
export type Post = z.infer<typeof PostSchema>;
export type Investigacion = z.infer<typeof InvestigacionSchema>;
export type FeatureImages = z.infer<typeof featuredImagesSchema>;
export type Category = z.infer<typeof CategorySchema>;