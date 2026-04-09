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

/**
 * Intelligent local parser that extracts structured data from job description text.
 * Uses multiple heuristic strategies to maximize extraction accuracy.
 */
const mockParseJobDescription = (jdText: string): ParsedJD => {
  const lines = jdText.split('\n').map(l => l.trim()).filter(Boolean);
  const lowerJD = jdText.toLowerCase();

  // ========== COMPANY EXTRACTION ==========
  let company = 'Unknown Company';
  const companyPatterns = [
    // "About Google" / "About the Company: Stripe"
    /about\s+(?:the\s+company[:\s]*)?([A-Z][A-Za-z0-9.\s&'-]+?)(?:\s*[,.\n])/i,
    // "Company: Microsoft"
    /company[:\s]+([A-Z][A-Za-z0-9.\s&'-]+?)(?:\s*[,.\n])/i,
    // "at Google," / "at Stripe." / "join Google"
    /(?:at|join|with)\s+([A-Z][A-Za-z0-9.&'-]+(?:\s+[A-Z][A-Za-z0-9.&'-]+){0,3})(?:\s*[,.!\s])/,
    // First line often contains company name
    /^([A-Z][A-Za-z0-9.\s&'-]{2,30})$/m,
    // "Google is looking" / "Stripe is hiring"
    /^([A-Z][A-Za-z0-9.&'-]+(?:\s+[A-Z][A-Za-z0-9.&'-]+){0,2})\s+(?:is|are)\s+(?:looking|hiring|seeking)/m,
  ];
  for (const p of companyPatterns) {
    const m = jdText.match(p);
    if (m && m[1].trim().length > 1 && m[1].trim().length < 40) {
      company = m[1].trim();
      break;
    }
  }

  // ========== ROLE EXTRACTION ==========
  let role = 'Software Engineer';
  const rolePatterns = [
    // "Job Title: Senior Software Engineer"
    /(?:job\s*title|position|role|title)[:\s]+([^\n,]{5,60})/i,
    // "We are hiring a Senior Software Engineer"
    /(?:hiring|looking\s+for|seeking)\s+(?:a\s+|an\s+)?([A-Z][A-Za-z\s/()-]+(?:Engineer|Developer|Designer|Manager|Analyst|Architect|Lead|Director|Scientist|Specialist|Consultant|Coordinator))/i,
    // First/second line pattern: "Senior Software Engineer" (standalone title)
    /^((?:Senior|Junior|Lead|Staff|Principal|Chief|Head|VP|Director|Associate)?\s*(?:of\s+)?[A-Za-z\s/()]+(?:Engineer|Developer|Designer|Manager|Analyst|Architect|Lead|Director|Scientist|Product|Marketing))$/im,
    // Generic role title on its own line
    /^([A-Z][A-Za-z\s/()-]{10,50}(?:Engineer|Developer|Designer|Manager|Analyst|Architect|Director|Scientist|Specialist|Lead))$/m,
  ];
  for (const p of rolePatterns) {
    const m = jdText.match(p);
    if (m && m[1].trim().length > 3) {
      role = m[1].trim().replace(/\s+/g, ' ');
      break;
    }
  }

  // ========== SKILLS EXTRACTION ==========
  const techSkills: Record<string, string> = {
    'react': 'React', 'react.js': 'React', 'reactjs': 'React',
    'typescript': 'TypeScript', 'javascript': 'JavaScript', 'python': 'Python',
    'java': 'Java', 'golang': 'Go', 'go ': 'Go', 'rust': 'Rust', 'ruby': 'Ruby',
    'c++': 'C++', 'c#': 'C#', '.net': '.NET', 'swift': 'Swift', 'kotlin': 'Kotlin',
    'node.js': 'Node.js', 'nodejs': 'Node.js', 'node': 'Node.js',
    'express': 'Express', 'express.js': 'Express',
    'next.js': 'Next.js', 'nextjs': 'Next.js',
    'vue': 'Vue.js', 'vue.js': 'Vue.js', 'angular': 'Angular', 'svelte': 'Svelte',
    'aws': 'AWS', 'amazon web services': 'AWS',
    'azure': 'Azure', 'gcp': 'GCP', 'google cloud': 'GCP',
    'docker': 'Docker', 'kubernetes': 'Kubernetes', 'k8s': 'Kubernetes',
    'terraform': 'Terraform', 'ansible': 'Ansible',
    'mongodb': 'MongoDB', 'postgresql': 'PostgreSQL', 'postgres': 'PostgreSQL',
    'mysql': 'MySQL', 'redis': 'Redis', 'elasticsearch': 'Elasticsearch',
    'graphql': 'GraphQL', 'rest api': 'REST APIs', 'restful': 'REST APIs',
    'tailwind': 'Tailwind CSS', 'tailwindcss': 'Tailwind CSS',
    'css': 'CSS', 'html': 'HTML', 'sass': 'Sass', 'scss': 'Sass',
    'git': 'Git', 'ci/cd': 'CI/CD', 'jenkins': 'Jenkins', 'github actions': 'GitHub Actions',
    'kafka': 'Kafka', 'rabbitmq': 'RabbitMQ',
    'machine learning': 'Machine Learning', 'deep learning': 'Deep Learning',
    'tensorflow': 'TensorFlow', 'pytorch': 'PyTorch',
    'nlp': 'NLP', 'natural language processing': 'NLP',
    'llm': 'LLMs', 'large language model': 'LLMs',
    'figma': 'Figma', 'sketch': 'Sketch',
    'agile': 'Agile', 'scrum': 'Scrum', 'jira': 'Jira',
    'sql': 'SQL', 'nosql': 'NoSQL',
    'firebase': 'Firebase', 'supabase': 'Supabase',
    'linux': 'Linux', 'unix': 'Unix',
    'microservices': 'Microservices', 'api design': 'API Design',
    'system design': 'System Design', 'data structures': 'Data Structures',
    'algorithms': 'Algorithms',
    'django': 'Django', 'flask': 'Flask', 'spring': 'Spring Boot',
    'rails': 'Ruby on Rails',
    'php': 'PHP', 'laravel': 'Laravel',
  };

  const foundSkills = new Set<string>();
  for (const [keyword, name] of Object.entries(techSkills)) {
    if (lowerJD.includes(keyword)) {
      foundSkills.add(name);
    }
  }
  const skills = Array.from(foundSkills).slice(0, 8);
  if (skills.length === 0) skills.push('JavaScript', 'React', 'Node.js');

  // Nice to have: look for "nice to have" / "bonus" / "preferred" sections
  const niceToHaveSkills: string[] = [];
  const niceSection = jdText.match(/(?:nice.to.have|bonus|preferred|plus|desired)[:\s]*\n?([\s\S]{20,500}?)(?:\n\n|\n[A-Z])/i);
  if (niceSection) {
    const sectionText = niceSection[1].toLowerCase();
    for (const [keyword, name] of Object.entries(techSkills)) {
      if (sectionText.includes(keyword) && !skills.includes(name)) {
        niceToHaveSkills.push(name);
      }
    }
  }
  // Fallback: skills beyond the first 6
  if (niceToHaveSkills.length === 0) {
    const extras = Array.from(foundSkills).slice(6, 10);
    niceToHaveSkills.push(...extras);
  }

  // ========== SENIORITY DETECTION ==========
  let seniority = 'Mid-Level';
  if (/\b(?:senior|sr\.?|lead)\b/i.test(jdText)) seniority = 'Senior';
  else if (/\b(?:staff|principal|distinguished)\b/i.test(jdText)) seniority = 'Staff';
  else if (/\b(?:junior|jr\.?|entry.level|intern|associate)\b/i.test(jdText)) seniority = 'Junior';
  else if (/\b(?:director|vp|vice president|head of|chief)\b/i.test(jdText)) seniority = 'Executive';
  else if (/\b(?:manager|engineering manager)\b/i.test(jdText)) seniority = 'Manager';

  // ========== LOCATION DETECTION ==========
  let location = 'Not Specified';
  const locationPatterns = [
    /location[:\s]+([^\n]{3,50})/i,
    /(?:based in|located in|office in|headquarters in)\s+([^\n,.]{3,40})/i,
    /\b((?:San Francisco|New York|NYC|Seattle|Austin|Chicago|Boston|Denver|Los Angeles|LA|London|Berlin|Toronto|Singapore|Bangalore|Hyderabad|Remote|Hybrid|On-?site)[A-Za-z\s,/()]*)/i,
  ];
  for (const p of locationPatterns) {
    const m = jdText.match(p);
    if (m) { location = m[1].trim(); break; }
  }
  // Append remote/hybrid flag if found
  if (/\bremote\b/i.test(lowerJD) && !location.toLowerCase().includes('remote')) {
    location += location !== 'Not Specified' ? ' (Remote Available)' : 'Remote';
  } else if (/\bhybrid\b/i.test(lowerJD) && !location.toLowerCase().includes('hybrid')) {
    location += location !== 'Not Specified' ? ' (Hybrid)' : 'Hybrid';
  }

  return { company, role, skills, niceToHave: niceToHaveSkills, seniority, location };
};

/** Generate role-specific resume suggestions from parsed data */
const mockGenerateSuggestions = (parsedData: ParsedJD): string[] => {
  const { skills, role, company, seniority } = parsedData;
  const suggestions: string[] = [];

  if (skills.length >= 2) {
    suggestions.push(
      `Architected and delivered high-performance ${skills[0]} applications with ${skills[1]}, reducing page load times by 45% and improving user retention across the platform.`
    );
  }

  suggestions.push(
    `Led cross-functional collaboration as a ${seniority} contributor to ship ${role}-related features, aligning with product roadmaps and driving measurable business outcomes at scale.`
  );

  if (skills.length >= 3) {
    suggestions.push(
      `Engineered robust backend services using ${skills[2]}${skills[3] ? ' and ' + skills[3] : ''}, processing 10M+ daily transactions with 99.9% uptime SLA compliance.`
    );
  }

  suggestions.push(
    `Mentored a team of 5+ engineers, establishing code review standards and CI/CD best practices that reduced deployment failures by 70% and accelerated sprint velocity.`
  );

  suggestions.push(
    `Spearheaded technical design documents and architecture reviews for ${company}'s core product initiatives, directly influencing the engineering roadmap and reducing technical debt by 35%.`
  );

  return suggestions;
};

export const parseJobDescription = async (jdText: string): Promise<ParsedJD> => {
  const openai = getOpenAIClient();

  if (!openai) {
    return mockParseJobDescription(jdText);
  }

  const prompt = `You are a job description parser. Parse the following Job Description and extract structured data.

Return a JSON object with these exact keys:
- "company": string - the company name
- "role": string - the exact job title
- "skills": string[] - required technical skills (max 8)
- "niceToHave": string[] - nice-to-have or preferred skills
- "seniority": string - one of: "Junior", "Mid-Level", "Senior", "Staff", "Lead", "Manager", "Director", "Executive"
- "location": string - job location including remote/hybrid info

Return ONLY valid JSON, no other text.

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
      niceToHave: parsedContent.niceToHave || parsedContent['nice-to-have skills'] || parsedContent.nice_to_have || [],
      seniority: parsedContent.seniority || 'Unknown',
      location: parsedContent.location || 'Unknown'
    };
  } catch (error: any) {
    console.error("OpenAI Parsing Error:", error?.message || error);
    console.log("⚠ Falling back to intelligent local parser...");
    return mockParseJobDescription(jdText);
  }
};

export const generateResumeSuggestions = async (parsedData: ParsedJD): Promise<string[]> => {
  const openai = getOpenAIClient();

  if (!openai) {
    return mockGenerateSuggestions(parsedData);
  }

  const prompt = `You are a career coach. Based on these job details, generate 5 powerful resume bullet points.

Company: ${parsedData.company}
Role: ${parsedData.role}
Required Skills: ${parsedData.skills.join(', ')}
Nice-to-have: ${parsedData.niceToHave.join(', ')}
Seniority: ${parsedData.seniority}

Each bullet must:
- Start with a strong action verb (Led, Architected, Spearheaded, Engineered, etc.)
- Include specific metrics and quantified impact
- Reference at least one technology from the skills list
- Be specific to this role, never generic

Return ONLY a JSON object: { "suggestions": ["bullet1", "bullet2", ...] }`;

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
    console.log("⚠ Falling back to intelligent local suggestions...");
    return mockGenerateSuggestions(parsedData);
  }
};
