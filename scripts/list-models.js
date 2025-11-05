const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    process.exit(1);
  }

  console.log("API Key found:", apiKey.substring(0, 10) + "...");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // List available models
    console.log("\nFetching available models...\n");

    const models = await genAI.listModels();

    console.log("Available models:");
    models.forEach(model => {
      console.log(`- ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Supported Methods: ${model.supportedGenerationMethods.join(", ")}`);
      console.log("");
    });

  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
