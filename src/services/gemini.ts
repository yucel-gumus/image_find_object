
export interface GenerateContentConfig {
    temperature: number;
    thinkingConfig?: any;
}
export const generateContent = async (
    base64Image: string,
    promptText: string,
    config: GenerateContentConfig
): Promise<string> => {
    try {
        const apiUrl = (import.meta as any).env.VITE_API_URL || 'https://web-production-b26d7.up.railway.app/api/analyze-image';
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64Image,
                prompt: promptText,
                temperature: config.temperature,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Backend hatası oluştu');
        }

        const data = await response.json();
        return data.response || data.text || "";
    } catch (error) {
        console.error('Backend API Error:', error);
        throw error;
    }
};
