import { z } from 'astro:content';
const imageSchema = z.object({
    url: z.string(),
    width: z.number(),
    height: z.number()
})

const featureImagesSchema = z.object({
    thumbnail:imageSchema,
    medium:imageSchema,
    medium_large:imageSchema,
   

})
const acfImageSizeSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number()
}).optional();

const acfImageSizesSchema = z.object({
  thumbnail: acfImageSizeSchema,
  medium: acfImageSizeSchema,
  full: acfImageSizeSchema
}).optional();

// Tu esquema principal modificado
export const BaseWPSchema = z.object({
    id: z.number(),
    title: z.object({
        rendered: z.string()
    }),
    content: z.object({
        rendered: z.string()
    }),
    acf: z.object({
        subtitle: z.string(),
        imagen_uno: z.number().optional(), // Valida el ID numérico nativo
        imagen_dos: z.number().optional(),
        imagen_tres: z.number().optional()
    }),
    featured_images: z.object({
        medium: z.object({
            url: z.string(),
            width: z.number(),
            height: z.number()
        })
    }),
    
    // ================= VALIDAMOS EL NUEVO CAMPO PROCESADO =================
    acf_images_urls: z.object({
        imagen_uno: acfImageSizesSchema,
        imagen_dos: acfImageSizesSchema,
        imagen_tres: acfImageSizesSchema
    }).optional()
});