const axios = require('axios');

module.exports = async (req, res) => {
  // 1. 보안: POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 2. 사용자로부터 질문과 모델명 받기
  const { prompt, model } = req.body;

  if (!prompt || !model) {
    return res.status(400).json({ message: 'prompt and model are required' });
  }

  // 3. 서버에만 저장된 비밀 API 키 가져오기 (가장 중요한 부분)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;;

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    // 4. 백엔드 서버가 Gemini API에 요청 보내기
    const geminiResponse = await axios.post(API_URL, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    // 5. 결과를 다시 사용자 브라우저로 전송
    res.status(200).json(geminiResponse.data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error communicating with Gemini API' });
  }
};
