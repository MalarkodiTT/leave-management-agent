require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/api/analyze-leave', async (req, res) => {
    const { reason, email } = req.body;
    try {
        const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
            model: "llama-3.3-70b-versatile",
            messages: [
                { "role": "system", "content": "You are a Leave Approval Agent. Return output strictly in JSON format: {'decision': 'Approve', 'reason': 'Explanation'}" },
                { "role": "user", "content": `Analyze leave request from ${email} for: ${reason}` }
            ],
            response_format: { type: "json_object" }
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        res.json(JSON.parse(response.data.choices[0].message.content));
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json({ decision: "Error", reason: "Server connection failed" });
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));