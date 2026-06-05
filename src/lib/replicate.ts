const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN!
const REPLICATE_BASE_URL = "https://api.replicate.com/v1"

async function replicateRequest(endpoint: string, body: object) {
  const response = await fetch(`${REPLICATE_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error(`Replicate API error: ${response.status} ${await response.text()}`)
  }
  return response.json()
}

async function pollForResult(predictionId: string, maxAttempts = 60): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 2000))
    const response = await fetch(`${REPLICATE_BASE_URL}/predictions/${predictionId}`, {
      headers: { Authorization: `Bearer ${REPLICATE_API_TOKEN}` },
    })
    const prediction = await response.json()
    if (prediction.status === "succeeded") {
      return Array.isArray(prediction.output) ? prediction.output[0] : prediction.output
    }
    if (prediction.status === "failed") {
      throw new Error(`Prediction failed: ${prediction.error}`)
    }
  }
  throw new Error("Prediction timed out")
}

export async function removeFurniture(imageUrl: string): Promise<string> {
  const prediction = await replicateRequest("/predictions", {
    version: "9283608cc6b7be6b65a8e44983db012355f829f55c8e4f4f82f12f260f5fc64b", // lama-cleaner
    input: {
      image: imageUrl,
      mask: imageUrl, // will be replaced with actual mask
      ldm_steps: 50,
    },
  })
  return pollForResult(prediction.id)
}

export async function virtualStage(
  imageUrl: string,
  roomType: string,
  style: string
): Promise<string> {
  const prompt = `A beautifully staged ${roomType.replace("_", " ")} with ${style} interior design, professional real estate photography, high quality, photorealistic, well-lit`
  const prediction = await replicateRequest("/predictions", {
    version: "95b7223104132402a9ae91cc677285bc5eb997834bd2349fa486f53910fd68b3", // stable-diffusion-inpainting
    input: {
      prompt,
      image: imageUrl,
      num_inference_steps: 50,
      guidance_scale: 7.5,
    },
  })
  return pollForResult(prediction.id)
}

export async function convertToTwilight(imageUrl: string): Promise<string> {
  const prediction = await replicateRequest("/predictions", {
    version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4", // real-esrgan or img2img
    input: {
      image: imageUrl,
      prompt: "twilight exterior real estate photo, golden hour, warm sky, professional photography, dusk lighting",
      num_inference_steps: 30,
      prompt_strength: 0.6,
    },
  })
  return pollForResult(prediction.id)
}

export async function enhancePhoto(imageUrl: string): Promise<string> {
  const prediction = await replicateRequest("/predictions", {
    version: "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b", // real-esrgan upscaler
    input: {
      image: imageUrl,
      scale: 2,
      face_enhance: false,
    },
  })
  return pollForResult(prediction.id)
}
