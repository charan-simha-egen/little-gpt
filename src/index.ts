import express, { Request, Response } from "express";
import axios, { AxiosRequestConfig } from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/heart-beat", (req: Request, res: Response) => {
  res.send("Im fine!");
});

app.post("/api/prompt", async (req: Request, res: Response) => {

  // Send the prompt to the ChatGPT API
  const requestConfig: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const data = {
    model: "gpt-3.5-turbo", 
    max_tokens: 2048,
    messages: [
      { role: "user", content: req.body.prompt },
    ],
  };

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      data,
      requestConfig
    );

    // Process the response from the ChatGPT API
    const chatgpt_response: string = response.data.choices[0].message.content.trim();

    // Return the response from the ChatGPT API
    res.json(chatgpt_response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});
