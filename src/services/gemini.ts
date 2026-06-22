export interface GenerateContentConfig {
  temperature: number;
  thinkingConfig?: unknown;
}

const apiUrl = (): string => {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
  return base ? `${base}/api/analyze-image` : '/api/analyze-image';
};

export const generateContent = async (
  base64Image: string,
  promptText: string,
  config: GenerateContentConfig
): Promise<string> => {
  const response = await fetch(apiUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64Image,
      prompt: promptText,
      mime_type: 'image/png',
      temperature: config.temperature,
    }),
  });

  if (!response.ok) {
    let detail = `Backend hatası: ${response.status}`;
    try {
      const errorData = await response.json();
      detail = errorData.detail || errorData.error || detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  const data = await response.json();
  return data.text ?? data.response ?? '';
};