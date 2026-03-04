import fs from 'fs';
import path from 'path';

const API_KEY = 'AIzaSyDewOKde-hXvBjMTXFNLXlmvmOvx_h1yFI';
const OUTPUT_DIR = './public/images';
const PRESENTATION_FILE = './public/presentation.json';

// Slides that should get images, with prompts
const imageSlides = [
  {
    slideId: 's01',
    filename: 'hero-solar.png',
    prompt: 'Professional aerial photograph of modern solar panels installed on a large commercial warehouse rooftop, bright sunny day, clean industrial area, photorealistic, 16:9 aspect ratio, corporate photography style',
    position: { x: 0, y: 0, width: 100, height: 100 },
    opacity: 0.15,
    insertAt: 0, // behind everything
  },
  {
    slideId: 's03',
    filename: 'team-office.png',
    prompt: 'Modern bright office interior of a renewable energy company, large windows with sunlight, minimalist design with green plants, professional workspace, photorealistic, corporate photography',
    position: { x: 62, y: 16, width: 34, height: 30 },
    opacity: 1,
    insertAt: 0,
  },
  {
    slideId: 's09',
    filename: 'solar-modules.png',
    prompt: 'Close-up professional product photo of premium solar panels and inverter equipment, clean white background, high-end technology look, studio lighting, commercial product photography',
    position: { x: 8, y: 80, width: 84, height: 12 },
    opacity: 0.6,
    insertAt: 0,
  },
  {
    slideId: 's10',
    filename: 'weiss-automotive.png',
    prompt: 'Aerial photograph of a large industrial building with solar panels covering the entire rooftop, German commercial area, photorealistic, sunny day, drone photography perspective',
    position: { x: 8, y: 68, width: 84, height: 24 },
    opacity: 1,
    insertAt: 0,
  },
  {
    slideId: 's14',
    filename: 'closing-solar.png',
    prompt: 'Beautiful sunset over solar panels on a commercial rooftop, warm golden light, sustainable energy concept, professional photography, inspiring atmosphere, 16:9',
    position: { x: 0, y: 0, width: 100, height: 100 },
    opacity: 0.12,
    insertAt: 0,
  },
];

async function generateImage(prompt, filename) {
  const outPath = path.join(OUTPUT_DIR, filename);

  // Skip if already exists
  if (fs.existsSync(outPath)) {
    console.log(`  ✓ ${filename} already exists, skipping`);
    return true;
  }

  console.log(`  ⏳ Generating: ${filename}...`);

  // Try Imagen 4.0 first
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { sampleCount: 1, aspectRatio: '16:9' },
        }),
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.predictions?.[0]?.bytesBase64Encoded) {
        const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
        fs.writeFileSync(outPath, buffer);
        console.log(`  ✅ ${filename} saved (${(buffer.length / 1024).toFixed(0)} KB)`);
        return true;
      }
    }

    // Fallback: Gemini 2.5 Flash image generation
    console.log(`  🔄 Trying Gemini 2.5 Flash image generation...`);
    const res2 = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate this image: ${prompt}` }] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
      }
    );

    if (res2.ok) {
      const data2 = await res2.json();
      const parts = data2.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          const buffer = Buffer.from(part.inlineData.data, 'base64');
          fs.writeFileSync(outPath, buffer);
          console.log(`  ✅ ${filename} saved (${(buffer.length / 1024).toFixed(0)} KB)`);
          return true;
        }
      }
    }

    const errText = await res.text();
    console.log(`  ❌ Failed: ${filename} - ${errText.slice(0, 200)}`);
    return false;
  } catch (err) {
    console.log(`  ❌ Error: ${filename} - ${err.message}`);
    return false;
  }
}

function updatePresentation(generatedImages) {
  const data = JSON.parse(fs.readFileSync(PRESENTATION_FILE, 'utf-8'));

  for (const img of generatedImages) {
    const slide = data.slides.find(s => s.id === img.slideId);
    if (!slide) continue;

    const imageElement = {
      id: `${img.slideId}-img`,
      type: 'image',
      x: img.position.x,
      y: img.position.y,
      width: img.position.width,
      height: img.position.height,
      rotation: 0,
      content: `/images/${img.filename}`,
      style: {
        objectFit: 'cover',
        opacity: img.opacity,
        borderRadius: img.position.width === 100 ? 0 : 8,
      },
    };

    // Remove old image element if exists
    slide.elements = slide.elements.filter(e => e.id !== imageElement.id);

    // Insert at position
    slide.elements.splice(img.insertAt, 0, imageElement);
  }

  data.updatedAt = Date.now();
  fs.writeFileSync(PRESENTATION_FILE, JSON.stringify(data, null, 2));
  console.log(`\n✅ Presentation updated with ${generatedImages.length} images`);
}

async function main() {
  console.log('🎨 Generating images for BetterEnergy presentation...\n');

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const generated = [];

  for (const img of imageSlides) {
    const success = await generateImage(img.prompt, img.filename);
    if (success) generated.push(img);
  }

  if (generated.length > 0) {
    updatePresentation(generated);
  } else {
    console.log('\n⚠️  No images were generated. Check your API key and quota.');
  }
}

main();
