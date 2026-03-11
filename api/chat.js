const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
    // อนุญาตให้หน้าเว็บส่งข้อมูลมาได้
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // ดึง API Key จากระบบของ Vercel (ที่เราจะไปตั้งค่าพรุ่งนี้)
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    
    try {
        const { prompt, score, focusLevel } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const systemInstruction = `คุณคือที่ปรึกษา EduSmart AI คะแนนสมาธิคือ ${score || 0}% ระดับคือ ${focusLevel || 'ปกติ'}`;
        
        const result = await model.generateContent(systemInstruction + "\nคำถาม: " + prompt);
        const aiResponse = result.response.text();

        res.status(200).json({ result: aiResponse });
    } catch (error) {
        res.status(500).json({ result: "เกิดข้อผิดพลาด: " + error.message });
    }
}