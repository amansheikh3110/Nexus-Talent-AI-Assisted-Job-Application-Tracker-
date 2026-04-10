import OpenAI from 'openai';

/**
 * ============================================================================
 * TYPES & INTERFACES
 * ============================================================================
 */

export interface ParsedJD {
  company: string;
  role: string;
  skills: string[];
  niceToHave: string[];
  seniority: string;
  location: string;
}

/**
 * ============================================================================
 * CONFIGURATION & CONSTANTS
 * ============================================================================
 */

/**
 * List of free AI models available on OpenRouter.
 * The system will cascade through these if any fail due to rate limits or errors.
 */
const FREE_MODELS = [
  "nvidia/nemotron-3-super-120b-a12b:free",
  "arcee-ai/trinity-large-preview:free",
  "z-ai/glm-4.5-air:free",
  "openai/gpt-oss-120b:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "minimax/minimax-m2.5:free",
  "google/gemma-4-31b-it:free",
  "qwen/qwen3-coder:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-oss-20b:free"
];

/**
 * ============================================================================
 * PRIVATE HELPERS
 * ============================================================================
 */

/**
 * Initializes the OpenRouter client using OpenAI's SDK.
 * @throws Error if the API key is missing or set to placeholder.
 */
const getOpenRouterClient = (): OpenAI => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'YOUR_OPENROUTER_API_KEY') {
    throw new Error("Missing OpenRouter API Key in environment variables.");
  }

  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'Nexus Talent Platform',
    }
  });
};

/**
 * ============================================================================
 * PUBLIC AI SERVICES
 * ============================================================================
 */

/**
 * Parses a raw Job Description text into structured data using AI.
 * Implements a cascading fallback mechanism across multiple free models.
 * 
 * @param jdText The raw text of the job description
 * @returns Structured job details
 */
export const parseJobDescription = async (jdText: string): Promise<ParsedJD> => {
  const openrouter = getOpenRouterClient();

  const prompt = `You are an expert job description parser. Parse the following Job Description and extract structured data.

Return a JSON object with these exact keys:
- "company": string - the company name (extract it if possible, else return "Unknown Company")
- "role": string - the exact job title
- "skills": string[] - required technical skills (max 8)
- "niceToHave": string[] - nice-to-have or preferred skills
- "seniority": string - one of: "Junior", "Mid-Level", "Senior", "Staff", "Lead", "Manager", "Director", "Executive"
- "location": string - job location including remote/hybrid info

Return ONLY valid JSON, no other text or formatting wrappers like \`\`\`json. The output should be parsed directly by JSON.parse().

Job Description:
${jdText}`;

  const startTime = Date.now();
  console.log(`\n[AI Parser] 🧠 Initiating Job Description Parse...`);

  for (const modelUsed of FREE_MODELS) {
    try {
      console.log(`[AI Parser] 🤖 Attempting Model: ${modelUsed}...`);

      const response = await openrouter.chat.completions.create({
        model: modelUsed,
        messages: [{ role: "user", content: prompt }],
      });

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[AI Parser] ✅ Success with ${modelUsed}! Parsed in ${elapsed}s`);

      let content = response.choices[0].message.content || '{}';
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsedContent = JSON.parse(content);
      console.log(`[AI Parser] 🏢 Extracted Role: ${parsedContent.role || 'Unknown'} at ${parsedContent.company || 'Unknown'}`);

      return {
        company: parsedContent.company || 'Unknown Company',
        role: parsedContent.role || 'Unknown Role',
        skills: parsedContent.skills || parsedContent['required skills'] || [],
        niceToHave: parsedContent.niceToHave || parsedContent['nice-to-have skills'] || parsedContent.nice_to_have || [],
        seniority: parsedContent.seniority || 'Mid-Level',
        location: parsedContent.location || 'Not Specified'
      };
    } catch (error: any) {
      console.log(`[AI Parser] ⚠️ Model ${modelUsed} failed: ${error?.message || 'Unknown error'}. Switching to next model...`);
    }
  }

  console.error("[AI Parser] ❌ All fallback models failed.");
  throw new Error(`Real-Time AI Parsing Failed across all available free models.`);
};

/**
 * Generates metric-driven resume bullet points based on parsed job data.
 * Implements a cascading fallback mechanism across multiple free models.
 * 
 * @param parsedData Structured data from the job description
 * @returns Array of 5 generated bullet points
 */
export const generateResumeSuggestions = async (parsedData: ParsedJD): Promise<string[]> => {
  const openrouter = getOpenRouterClient();

  const prompt = `You are an expert career coach helping a software engineer. Based on these job details, generate 5 powerful, impactful resume bullet points.

Company: ${parsedData.company}
Role: ${parsedData.role}
Required Skills: ${parsedData.skills.join(', ')}
Nice-to-have: ${parsedData.niceToHave.join(', ')}
Seniority: ${parsedData.seniority}

Each bullet must:
- Start with a strong action verb (Led, Architected, Spearheaded, Engineered, etc.)
- Include impressive sounding metrics and quantified impact
- Reference at least one technology from the skills list
- Be specific to this role and sound highly professional.

Return ONLY a valid JSON object matching this structure: { "suggestions": ["bullet1", "bullet2", ...] }. Do not return any other text, no markdown wrappers.`;

  const startTime = Date.now();
  console.log(`\n[AI Optimizer] ✍️ Generating Resume Suggestions...`);

  for (const modelUsed of FREE_MODELS) {
    try {
      console.log(`[AI Optimizer] 🤖 Attempting Model: ${modelUsed}...`);

      const response = await openrouter.chat.completions.create({
        model: modelUsed,
        messages: [{ role: "user", content: prompt }]
      });

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[AI Optimizer] ✅ Success with ${modelUsed}! Options generated in ${elapsed}s`);

      let content = response.choices[0].message.content || '{"suggestions":[]}';
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();

      const result = JSON.parse(content);
      return result.suggestions || [];
    } catch (error: any) {
      console.log(`[AI Optimizer] ⚠️ Model ${modelUsed} failed: ${error?.message || 'Unknown error'}. Switching to next model...`);
    }
  }

  console.error("[AI Optimizer] ❌ All fallback models failed.");
  throw new Error(`Real-Time AI Generation Failed across all available models.`);
};

/**
 * ============================================================================
 * LEGACY / MOCK FALLBACKS (Archived for reference)
 * ============================================================================
 * NOTE: These are currently not in use. The system now utilizes a full 
 * OpenRouter-based cascading fallback system.
 * 
 * const getOpenAIClient = () => { ... };
 * const mockParseJobDescription = (jdText: string) => { ... };
 * const mockGenerateSuggestions = (parsedData: ParsedJD) => { ... };
 */
