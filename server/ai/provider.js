/**
 * DevLens AI Provider
 * Connects directly to Google Gemini using standard official Generative Language API.
 * Grounded strictly in repository context provided by DevLens.
 */

export class AIProvider {
  constructor() {
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  getApiKey() {
    return process.env.GEMINI_API_KEY || '';
  }

  /**
   * Builds a compact, token-efficient repository context representation
   */
  buildCompactContext(analysis) {
    const { repository, metrics, techStack, frameworks, projectType, architecture, structure, observations, aiContextReady } = analysis;

    const sections = [];

    // 1. Core Metadata
    sections.push(`## Repository Metadata
- Full Name: ${repository.fullName}
- Description: ${repository.description || 'No description provided'}
- Primary Language: ${repository.primaryLanguage}
- License: ${repository.license}
- Default Branch: ${repository.branch}
- Total Files: ${metrics.totalFiles} | Total Directories: ${metrics.totalDirectories}`);

    // 2. Project Classification & Inferred Pattern
    sections.push(`## Architectural Profile
- Inferred Project Type: ${projectType}
- Inferred Architecture Pattern: ${architecture?.pattern || 'Layered Architecture'}
- Overview: ${architecture?.description || 'Standard software repository'}`);

    // 3. Technologies & Languages
    const topLangs = (techStack.languages || []).slice(0, 5).map(l => `${l.name} (${l.percentage}%)`).join(', ');
    const backendTech = (techStack.backend || []).map(b => b.name).join(', ') || 'None explicitly detected';
    const frontendTech = (techStack.frontend || []).map(f => f.name).join(', ') || 'None explicitly detected';
    const devopsTech = (techStack.devops || []).map(d => d.name).join(', ') || 'None explicitly detected';
    const dbTech = (techStack.database || []).map(d => d.name).join(', ') || 'None explicitly detected';

    sections.push(`## Technology Stack
- Languages: ${topLangs || 'Unknown'}
- Backend: ${backendTech}
- Frontend: ${frontendTech}
- DevOps & CI/CD: ${devopsTech}
- Databases / ORM: ${dbTech}`);

    // 4. Frameworks & Dependencies
    if (frameworks && frameworks.length > 0) {
      sections.push(`## Detected Frameworks & Dependencies\n` + frameworks.map(f => `- ${f.name} (${f.category})`).join('\n'));
    }

    // 5. Entry Points
    if (architecture?.entryPoints && architecture.entryPoints.length > 0) {
      sections.push(`## Application Entry Points\n` + architecture.entryPoints.map(e => `- \`${e.path}\` (${e.type}, ${e.language})`).join('\n'));
    }

    // 6. Classified Directory Roles
    if (structure?.classifiedDirectories && structure.classifiedDirectories.length > 0) {
      sections.push(`## Directory Roles\n` + structure.classifiedDirectories.map(d => `- \`${d.path}\`: ${d.role} (${d.description})`).join('\n'));
    }

    // 7. Engineering Observations
    if (observations && observations.length > 0) {
      sections.push(`## Observations & Engineering Health\n` + observations.map(o => `- [${o.category}] ${o.title}: ${o.detail}`).join('\n'));
    }

    // 8. Manifest files list
    if (aiContextReady?.manifestFiles && aiContextReady.manifestFiles.length > 0) {
      sections.push(`## Present Manifest Files\n` + aiContextReady.manifestFiles.map(m => `- \`${m}\``).join('\n'));
    }

    // 9. Repository Files List
    if (aiContextReady?.filePaths && aiContextReady.filePaths.length > 0) {
      sections.push(`## Key Repository Files\n` + aiContextReady.filePaths.slice(0, 80).map(f => `- \`${f}\``).join('\n'));
    }

    // 10. README Excerpt
    if (aiContextReady?.sampleReadmeExcerpt) {
      sections.push(`## README Excerpt\n\`\`\`markdown\n${aiContextReady.sampleReadmeExcerpt.trim()}\n\`\`\``);
    }

    return sections.join('\n\n');
  }

  /**
   * Helper to execute Gemini generateContent request
   */
  async callGemini(systemInstruction, userPrompt) {
    const apiKey = this.getApiKey();
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('GEMINI_API_KEY is not configured in .env. Please add your key to enable Gemini features.');
    }

    const endpoint = `${this.baseUrl}/${this.modelName}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048
      }
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errMsg = errData.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(errMsg);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Gemini API returned an empty response.');
    }

    return text;
  }

  /**
   * Generates a deep architectural summary grounded strictly in the repo context
   */
  async generateArchitectureSummary(analysis) {
    try {
      const context = this.buildCompactContext(analysis);

      const systemInstruction = `You are DevLens AI, an expert software architecture analyst.
Analyze the provided repository context and produce a structured, factual executive architectural summary.

STRICT GROUNDING RULES:
1. Ground your explanation STRICTLY in the provided repository context.
2. Do NOT invent, assume, or hallucinate files, external databases, or services not present in the context.
3. Whenever discussing components, cite actual file paths and directory names (e.g. \`cmd/devlens/main.go\`, \`internal/analyzer/\`).
4. If something is not evident from the available context, clearly state that it is not visible or not present.
5. Provide the output in clean, concise GitHub markdown with these sections:
   - **Executive Architecture Overview**: High-level purpose and architectural pattern.
   - **Key Components & Responsibilities**: Role of major directories/files.
   - **Data & Execution Flow**: How the application starts and executes.
   - **Engineering Observations**: Key strengths or constraints observed.`;

      const prompt = `Here is the verified scan context for repository ${analysis.repository.fullName}:

${context}

Please generate the architectural summary following the grounding rules.`;

      const summaryText = await this.callGemini(systemInstruction, prompt);

      return {
        available: true,
        summary: summaryText,
        model: this.modelName
      };
    } catch (err) {
      console.error('[DevLens AI] Gemini summary error:', err.message);
      return {
        available: false,
        error: `Gemini Error: ${err.message}`,
        summary: null
      };
    }
  }

  /**
   * Answers developer natural language questions grounded strictly in the repo context
   */
  async answerQuestion(question, analysis) {
    try {
      const context = this.buildCompactContext(analysis);

      const systemInstruction = `You are DevLens AI Codebase Assistant.
Your objective is to answer questions about the repository based STRICTLY on the provided repository context.

STRICT GROUNDING RULES:
1. Ground all answers strictly in the provided context (metadata, manifest files, directory tree, technologies, entry points, README).
2. Do NOT invent files, functions, or external tools that are not in the context.
3. Always reference specific file paths (e.g. \`internal/scanner/scanner.go\`) whenever discussing features or structure.
4. If the context does not contain sufficient information to answer the question with certainty, EXPLICITLY state: "Based on the scanned repository context, this cannot be determined because [specific reason]." Do not guess or hallucinate.
5. Format your response in concise, well-structured GitHub markdown.`;

      const prompt = `Repository Scan Context for ${analysis.repository.fullName}:

${context}

User Question: "${question}"

Please provide a grounded answer following the rules above.`;

      const answerText = await this.callGemini(systemInstruction, prompt);

      return {
        available: true,
        answer: answerText,
        question,
        model: this.modelName
      };
    } catch (err) {
      console.error('[DevLens AI] Gemini Q&A error:', err.message);
      return {
        available: false,
        error: `Gemini Error: ${err.message}`,
        answer: null
      };
    }
  }
}

export const aiProvider = new AIProvider();
