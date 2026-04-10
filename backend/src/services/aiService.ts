import OpenAI from 'openai';

export interface ParsedJD {
  company: string;
  role: string;
  skills: string[];
  niceToHave: string[];
  seniority: string;
  location: string;
}

/**
 * OpenRouter Client Initialization
 * Uses the standard OpenAI library but points the endpoint to OpenRouter
 */
const getOpenRouterClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'YOUR_OPENROUTER_API_KEY') {
    throw new Error("Missing OpenRouter API Key in environment variables.");
  }

  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:5173', // Optional, for including your app on openrouter.ai rankings
      'X-Title': 'Nexus Talent Platform', // Optional. Shows in rankings on openrouter.ai
    }
  });
};

/* =====================================================================
   COMMENTED OUT: Old OpenAI + Mock Fallback Logic (kept for history)
   =====================================================================
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY') {
    return null;
  }
  return new OpenAI({ apiKey });
};

const mockParseJobDescription = (jdText: string): ParsedJD => {
  ... Old regex fallback logic...
};

const mockGenerateSuggestions = (parsedData: ParsedJD): string[] => {
  ... Old suggestion fallback logic...
};
===================================================================== */

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

  try {
    const modelUsed = "nvidia/nemotron-3-super-120b-a12b:free";
    console.log(`\n[AI Parser] 🧠 Initiating Job Description Parse...`);
    console.log(`[AI Parser] 🤖 Model: ${modelUsed}`);
    console.log(`[AI Parser] ⏳ Waiting for OpenRouter response...`);

    const startTime = Date.now();
    const response = await openrouter.chat.completions.create({
      // Using a free model on OpenRouter:
      model: modelUsed, // Alternatives: meta-llama/llama-3-8b-instruct:free
      messages: [{ role: "user", content: prompt }],
      // response_format: { type: "json_object" } // Some free models don't support JSON mode perfectly, we enforce it via prompting
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[AI Parser] ✅ Success! Parsed in ${elapsed}s`);

    let content = response.choices[0].message.content || '{}';
    // Clean up potential markdown formatting wrappers returned by some free models
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
    console.error("OpenRouter Parsing Error:", error?.message || error);
    throw new Error(`Real-Time AI Parsing Failed: ${error.message}`);
  }
};

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

Return ONLY a valid JSON object matching this structure: { "suggestions": ["bullet1", "bullet2", ...] }. Do not return any other text, no markdown wrappers.

`;

  try {
    const modelUsed = "nvidia/nemotron-3-super-120b-a12b:free";
    console.log(`\n[AI Optimizer] ✍️ Generating Resume Suggestions...`);
    console.log(`[AI Optimizer] 🤖 Model: ${modelUsed}`);
    console.log(`[AI Optimizer] ⏳ Waiting for OpenRouter response...`);

    const startTime = Date.now();
    const response = await openrouter.chat.completions.create({
      // We use a fast free model
      model: modelUsed,
      messages: [{ role: "user", content: prompt }]
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[AI Optimizer] ✅ Success! Options generated in ${elapsed}s`);

    let content = response.choices[0].message.content || '{"suggestions":[]}';
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();

    const result = JSON.parse(content);
    return result.suggestions || [];
  } catch (error: any) {
    console.error("OpenRouter Suggestion Error:", error?.message || error);
    throw new Error(`Real-Time AI Generation Failed: ${error.message}`);
  }
};
