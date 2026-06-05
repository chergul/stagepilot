import { fal } from "@fal-ai/client"

fal.config({ credentials: process.env.FAL_KEY })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getUrl(result: any, key: "image" | "images"): string {
  if (key === "images") return result.images[0].url
  return result.image.url
}

export async function removeFurnitureWithFal(imageUrl: string): Promise<string> {
  const result = await fal.subscribe("fal-ai/lama-cleaner/lama", {
    input: {
      image_url: imageUrl,
      mask_url: imageUrl,
    },
  })
  return getUrl(result, "image")
}

export async function virtualStageWithFal(
  imageUrl: string,
  roomType: string,
  style: string
): Promise<string> {
  const prompt = `A beautifully staged ${roomType.replace(/_/g, " ")} interior, ${style} design style, professional real estate photography, high quality, photorealistic, bright natural lighting, elegant furniture`
  const result = await fal.subscribe("fal-ai/stable-diffusion-v3-medium/image-to-image", {
    input: {
      image_url: imageUrl,
      prompt,
      negative_prompt: "blurry, low quality, distorted, ugly, bad proportions, dark",
      strength: 0.7,
      num_inference_steps: 35,
      guidance_scale: 7.5,
    },
  })
  return getUrl(result, "images")
}

export async function convertToTwilightWithFal(imageUrl: string): Promise<string> {
  const result = await fal.subscribe("fal-ai/stable-diffusion-v3-medium/image-to-image", {
    input: {
      image_url: imageUrl,
      prompt: "exterior real estate photo at twilight dusk, golden hour warm sky, purple and orange clouds, interior lights on, professional real estate photography",
      negative_prompt: "daytime, bright sun, overexposed",
      strength: 0.65,
      num_inference_steps: 30,
      guidance_scale: 8,
    },
  })
  return getUrl(result, "images")
}

export async function enhancePhotoWithFal(imageUrl: string): Promise<string> {
  const result = await fal.subscribe("fal-ai/aura-sr", {
    input: {
      image_url: imageUrl,
      upscale_factor: 2,
      overlapping_tiles: true,
    },
  })
  return getUrl(result, "image")
}

export async function removeObjectWithFal(imageUrl: string, maskUrl: string): Promise<string> {
  const result = await fal.subscribe("fal-ai/lama-cleaner/lama", {
    input: {
      image_url: imageUrl,
      mask_url: maskUrl,
    },
  })
  return getUrl(result, "image")
}
