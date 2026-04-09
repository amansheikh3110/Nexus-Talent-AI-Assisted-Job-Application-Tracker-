import OpenAI from 'openai';

export interface ParsedJD {
  company: string;
  role: string;
  skills: string[];
  niceToHave: string[];
  seniority: string;
  location: string;
}

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY') {
    return null;
  }
  return new OpenAI({ apiKey });
};

/** Intelligent mock parse that extracts keywords from the real JD text */
const mockParseJobDescription = (jdText: string): ParsedJD => {
  const lowerJD = jdText.toLowerCase();

  // Try to extract company name from common patterns
  let company = 'Unknown Company';
  const companyPatterns = [
    /(?:at|join|about)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\.|,|\s+is|\s+are|\s+we)/,
    /^([A-Z][A-Za-z0-9\s&]+?)(?:\s*[-–|]\s)/m,
  ];
  for (const p of companyPatterns) {
    const m = jdText.match(p);
    if (m) { company = m[1].trim(); break; }
  }

  // Try to extract role from common patterns
  let role = 'Software Engineer';
  const rolePatterns = [
    /(?:position|role|title|hiring|looking for)[:\s]+([^\n.]+)/i,
    /^((?:Senior|Junior|Lead|Staff|Principal)\s+[A-Za-z\s]+(?:Engineer|Developer|Designer|Manager|Analyst))/im,
  ];
  for (const p of rolePatterns) {
    const m = jdText.match(p);
    if (m) { role = m[1].trim(); break; }
  }

  // Extract skills by matching common tech keywords
  const allSkills = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'Go', 'Rust',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'MySQL',
    'GraphQL', 'REST', 'Next.js', 'Vue', 'Angular', 'Tailwind', 'CSS', 'HTML',
    'Redis', 'Kafka', 'RabbitMQ', 'Git', 'CI/CD', 'Terraform', 'Linux',
    'Machine Learning', 'AI', 'NLP', 'Deep Learning', 'TensorFlow', 'PyTorch',
    'Figma', 'Sketch', 'Product Management', 'Agile', 'Scrum', 'Jira',
    'Express', 'Django', 'Flask', 'Spring', 'Ruby', 'Rails', 'Swift', 'Kotlin',
    'SQL', 'NoSQL', 'Firebase', 'Supabase', 'Elasticsearch', 'C++', 'C#', '.NET'
  ];
  const foundSkills = allSkills.filter(s => lowerJD.includes(s.toLowerCase()));
  const skills = foundSkills.length > 0 ? foundSkills.slice(0, 6) : ['JavaScript', 'React', 'Node.js'];
  const niceToHave = foundSkills.length > 6 ? foundSkills.slice(6, 9) : ['Docker', 'AWS'];

  // Seniority detection
  let seniority = 'Mid-Level';
  if (lowerJD.includes('senior') || lowerJD.includes('lead') || lowerJD.includes('principal')) seniority = 'Senior';
  else if (lowerJD.includes('junior') || lowerJD.includes('entry') || lowerJD.includes('intern')) seniority = 'Junior';
  else if (lowerJD.includes('staff') || lowerJD.includes('architect')) seniority = 'Staff';

  // Location detection
  let location = 'Not Specified';
  if (lowerJD.includes('remote')) location = 'Remote';
  else if (lowerJD.includes('hybrid')) location = 'Hybrid';
  else if (lowerJD.includes('on-site') || lowerJD.includes('onsite')) location = 'On-site';
  const cityMatch = jdText.match(/(?:located in|based in|location[:\s]+)([A-Za-z\s,]+)/i);
  if (cityMatch) location = cityMatch[1].trim().split('\n')[0];

  return { company, role, skills, niceToHave, seniority, location };
};

/** Intelligent mock suggestions based on actual parsed data */
const mockGenerateSuggestions = (parsedData: ParsedJD): string[] => {
  const suggestions: string[] = [];
  const { skills, role, company, seniority } = parsedData;

  suggestions.push(
    `Spearheaded development of production-grade applications using ${skills.slice(0, 3).join(', ')}, directly contributing to key business outcomes in a ${seniority.toLowerCase()}-level capacity.`
  );
  suggestions.push(
    `Designed and implemented scalable ${skills[0] || 'full-stack'} architectures, reducing system latency by 40% and improving developer productivity across cross-functional teams.`
  );
  suggestions.push(
    `Led end-to-end feature delivery for ${role}-related initiatives, collaborating with product, design, and engineering stakeholders to ship high-impact features on time.`
  );
  if (skills.length > 2) {
    suggestions.push(
      `Built robust CI/CD pipelines and automated testing frameworks using ${skills[1]} and ${skills[2]}, achieving 95%+ code coverage and reducing deployment failures by 60%.`
    );
  }
  suggestions.push(
    `Mentored junior engineers and contributed to technical documentation, fostering a culture of engineering excellence aligned with ${company}'s growth objectives.`
  );

  return suggestions;
};

export const parseJobDescription = async (jdText: string): Promise<ParsedJD> => {
  const openai = getOpenAIClient();
  
  if (!openai) {
    // No API key — use smart mock
    return mockParseJobDescription(jdText);
  }

  const prompt = `Parse the following Job Description into JSON format. Extract these fields exactly:
- "company": string (company name)
- "role": string (job title)
- "skills": string[] (required technical skills)
- "niceToHave": string[] (nice-to-have skills)
- "seniority": string (Junior, Mid-Level, Senior, Staff, Lead, etc.)
- "location": string (city, remote, hybrid, etc.)

Return ONLY valid JSON with these exact keys.
  
Job Description:
${jdText}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const parsedContent = JSON.parse(response.choices[0].message.content || '{}');
    return {
      company: parsedContent.company || 'Unknown',
      role: parsedContent.role || 'Unknown',
      skills: parsedContent.skills || parsedContent['required skills'] || [],
      niceToHave: parsedContent.niceToHave || parsedContent['nice-to-have skills'] || [],
      seniority: parsedContent.seniority || 'Unknown',
      location: parsedContent.location || 'Unknown'
    };
  } catch (error: any) {
    console.error("OpenAI Parsing Error:", error?.message || error);
    // Graceful fallback to mock on ANY API error (rate limit, network, etc.)
    console.log("Falling back to intelligent mock parser...");
    return mockParseJobDescription(jdText);
  }
};

export const generateResumeSuggestions = async (parsedData: ParsedJD): Promise<string[]> => {
  const openai = getOpenAIClient();
  
  if (!openai) {
    return mockGenerateSuggestions(parsedData);
  }

  const prompt = `Based on the following parsed job details:
Company: ${parsedData.company}
Role: ${parsedData.role}
Required Skills: ${parsedData.skills.join(', ')}
Nice-to-have: ${parsedData.niceToHave.join(', ')}
Seniority: ${parsedData.seniority}

Generate 4 to 5 resume bullet points tailored to this specific job. Each bullet should:
- Start with a strong action verb
- Include quantified impact where possible
- Reference specific technologies from the skills list
- Be specific to this role, not generic

Return ONLY a JSON object with key "suggestions" containing an array of strings.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(response.choices[0].message.content || '{"suggestions":[]}');
    return content.suggestions || [];
  } catch (error: any) {
    console.error("OpenAI Suggestion Error:", error?.message || error);
    // Graceful fallback to mock suggestions
    console.log("Falling back to intelligent mock suggestions...");
    return mockGenerateSuggestions(parsedData);
  }
};
