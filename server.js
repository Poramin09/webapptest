require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());


console.log("Checking API Key...", process.env.GOOGLE_API_KEY ? "Key Found! ✅" : "Key Not Found! ❌");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { prompt, score, focusLevel } = req.body;
        
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const systemInstruction = `คุณคือที่ปรึกษา AI assistant คะแนนสมาธิคือ ${score || 0} ระดับคือ ${focusLevel || 'ปกติ'}`;

        const result = await model.generateContent(systemInstruction + "\nคำถาม: " + prompt);
        const aiResponse = result.response.text();

        res.json({ result: aiResponse });
        
    } catch (error) {
        console.error("Error details:", error.message);
        res.status(500).json({ result: "ระบบขัดข้อง: " + error.message });
    }
});

app.listen(3000, () => console.log("Server is ready at http://localhost:3000"));
