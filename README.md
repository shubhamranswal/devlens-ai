# DevLens AI

Intelligent GitHub repository and architecture analyzer for software engineers.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-orange.svg)](https://ai.google.dev/)
[![GitHub](https://img.shields.io/badge/Platform-GitHub-181717.svg)](https://github.com/)

---

## Overview

Software engineers frequently need to evaluate and onboard into unfamiliar codebases. Reviewing repository structure, identifying frameworks, determining runtime entry points, and deducing architecture typically requires extensive manual exploration through configuration files and source trees.

DevLens AI automates this process. Given any public GitHub repository URL, DevLens AI extracts the repository structure, detects technologies and dependencies, maps the architectural topology, and generates an executive architectural briefing. Additionally, developers can query the codebase in natural language using an AI investigation assistant strictly grounded in the verified repository artifacts.

---

## Core Capabilities

- **Single-Shot Repository Ingestion**: Retrieves the entire repository file tree in a single API query using the GitHub Git Trees API, avoiding nested directory rate-limiting pitfalls.
- **Technology Detection**: Identifies languages, runtime environments, databases, container definitions, and configurations from file patterns and extensions.
- **Deep Manifest Parsing**: Analyzes manifest files (`package.json`, `go.mod`, `Cargo.toml`, `requirements.txt`, `pyproject.toml`, `pom.xml`) to extract dependencies and frameworks.
- **Architecture Mapping**: Infers the project archetype (CLI Tool, Backend API Service, Fullstack Web Application, Monorepo Workspace, or Library/SDK) and classifies component responsibilities.
- **Project Structure Exploration**: Classifies directory purposes (API, Core Domain, Frontend UI, Database Models, Tests, Automation) and presents an interactive, searchable file hierarchy.
- **Execution Entry Point Detection**: Identifies primary application start points across Go, Python, Node.js, TypeScript, Rust, and Java.
- **Engineering Observations**: Evaluates repository health including containerization (Docker), CI/CD pipelines (GitHub Actions), test suites, static typing, and documentation.
- **AI Architecture Summary**: Synthesizes a structured executive summary powered by Google Gemini, detailing system architecture, component roles, and data flow.
- **Ask Your Codebase**: Interactive investigation interface answering technical questions grounded strictly in scanned repository manifests and file paths.
- **Developer-Focused Interface**: Clean, information-dense interface with dark and light themes, keyboard navigation, and theme preference persistence via `localStorage`.

---

## Screenshots

Screenshots of the application interface:

```
[Overview Screen Placeholder: docs/screenshots/overview.png]
[Architecture Screen Placeholder: docs/screenshots/architecture.png]
[File Explorer Screen Placeholder: docs/screenshots/files.png]
[Ask Codebase Screen Placeholder: docs/screenshots/ask-codebase.png]
```

---

## Architecture

DevLens AI uses a decoupled client-server architecture designed for token efficiency and strict data grounding:

```
GitHub Repository
       |
       v
1. Ingestion Layer (server/analyzer/github.js)
   - Single-shot Git Trees API fetch
   - Raw manifest extraction (package.json, go.mod, etc.)
       |
       v
2. Static Analysis Pipeline (server/analyzer/)
   - techDetector.js: Language distribution & stack detection
   - frameworkDetector.js: Manifest dependency extraction
   - structureAnalyzer.js: Directory role categorization & tree construction
   - entryPointDetector.js: Application runtime start detection
   - architectureMapper.js: Pattern inference & component topology
   - observations.js: Engineering posture evaluation
       |
       v
3. Compact Context Assembly (server/ai/provider.js)
   - Verified metadata, file paths, manifests, and documentation excerpts
       |
       +------------------------------------+
       |                                    |
       v                                    v
4. Gemini Provider (server/ai/)      5. REST API (server/routes/)
   - Architecture Summary               - POST /api/analyze
   - Grounded Q&A Assistant             - POST /api/ai/summary
       |                                - POST /api/ai/ask
       +------------------------------------+
       |
       v
6. Web Interface (client/src/)
   - React 19 single-page application with Tailwind CSS
   - 4-tab workspace: Overview, Architecture, Files, Ask Codebase
```

---

## Tech Stack

### Backend
- **Node.js**: Server runtime environment.
- **Express 5**: HTTP API framework.
- **Google GenAI SDK & Generative Language API**: Integration with Google Gemini for grounded summaries and Q&A.
- **dotenv & CORS**: Environment configuration and cross-origin resource sharing.

### Frontend
- **React 19**: Component UI rendering.
- **Vite 8**: Build tool and development server.
- **Tailwind CSS 4**: Utility-first styling with dark/light variants.
- **Lucide React**: Developer tool icons.

---

## Project Structure

```
devlens-ai/
├── api/
│   └── index.js                      # Vercel serverless function entry point
├── assets/
│   ├── icon.png                      # DevLens logo icon
│   └── icon_no_bg.png                # DevLens transparent logo mark
├── client/
│   ├── index.html                    # Application HTML template
│   ├── public/                       # Static public assets (icons)
│   └── src/
│       ├── App.jsx                   # Main application controller & theme state
│       ├── index.css                 # Global styling and Tailwind variants
│       ├── main.jsx                  # React DOM root mounting
│       └── components/
│           ├── Header.jsx            # Application header, logo, and theme toggle
│           ├── RepoHeader.jsx        # Active repository header and tab bar
│           ├── RepoInput.jsx         # Search bar and reference presets
│           ├── AnalysisProgress.jsx  # Multi-step ingestion progress indicator
│           └── Tabs/
│               ├── OverviewTab.jsx   # Architecture summary, entry points, tech stack
│               ├── ArchitectureTab.jsx # Component relationships & execution pipeline
│               ├── FilesTab.jsx      # Searchable file explorer & directory hierarchy
│               └── AskCodebaseTab.jsx # Grounded Q&A investigation interface
├── server/
│   ├── index.js                      # Express server entry point & static SPA fallback
│   ├── ai/
│   │   └── provider.js               # Gemini integration & prompt grounding engine
│   ├── analyzer/
│   │   ├── index.js                  # Analysis coordinator
│   │   ├── github.js                 # GitHub API ingestion & manifest fetcher
│   │   ├── techDetector.js           # Multi-language technology detection
│   │   ├── frameworkDetector.js      # Manifest dependency parser
│   │   ├── structureAnalyzer.js      # Directory role classifier
│   │   ├── entryPointDetector.js     # Entry point identification
│   │   ├── architectureMapper.js     # Pattern inference & component mapping
│   │   └── observations.js           # DevOps, testing, and type safety checks
│   └── routes/
│       ├── analyze.js                # POST /api/analyze route
│       └── ai.js                     # POST /api/ai/summary and POST /api/ai/ask routes
├── .env.example                      # Template for environment variables
├── .gitignore                        # Git ignore rules
├── LICENSE                           # MIT License
├── package.json                      # Project metadata, dependencies, and scripts
├── vercel.json                       # Vercel deployment configuration
└── vite.config.js                    # Vite configuration with API proxy
```

---

## Getting Started

### Prerequisites
- Node.js 18.0.0 or later
- npm 9.0.0 or later
- A Google Gemini API key (obtainable from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shubhamranswal/devlens-ai.git
   cd devlens-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running the Application

#### Development Mode (Concurrent Server & Vite HMR)
```bash
npm run dev
```
This runs the Express API on port 5000 and the Vite development server on port 3000 with automatic proxying. Open `http://localhost:3000`.

#### Production Mode
1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the unified production server:
   ```bash
   npm start
   ```
   Open `http://localhost:5000`.

---

## Environment Variables

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Yes | None | Google Gemini API key used for architectural summaries and Q&A. |
| `GEMINI_MODEL` | No | `gemini-2.5-flash` | Gemini model name for generation. |
| `GITHUB_TOKEN` | No | None | Optional GitHub Personal Access Token to increase API rate limits. |
| `PORT` | No | `5000` | Local HTTP server port. |

Note: Never commit `.env` to source control. The `.gitignore` configuration explicitly excludes `.env` and `.env.*`.

---

## Usage

1. Open DevLens AI in your browser.
2. In the repository input field, enter any public GitHub URL (e.g. `https://github.com/shubhamranswal/devlens-ai`) or select one of the provided reference presets.
3. Click **Analyze** or press `Enter`.
4. Navigate through the analysis tabs:
   - **Overview**: View language distribution, detected frameworks, entry points, engineering observations, and click **Generate AI Summary** for an executive architectural report.
   - **Architecture**: Inspect the 3-tier execution flow, component responsibilities, and inferred architectural pattern.
   - **Files**: Search and browse the directory tree with item counts, file sizes, and directory role tags.
   - **Ask Codebase**: Inquire about specific components, file roles, or data paths. Responses are grounded in verified repository files.

---

## AI Grounding

DevLens AI is engineered to minimize hallucinations:

1. **Context Constrained**: All prompts are injected with verified scan artifacts including exact file paths, directory roles, parsed manifests, language statistics, and README excerpts.
2. **Strict System Instructions**: The AI engine is instructed to cite only existing files and to explicitly state when information cannot be determined from the available repository context.
3. **Deterministic Heuristics**: Technology and entry point classifications are executed deterministically before passing structured context to the language model.

---

## Limitations

- **Public Repositories**: The current release analyzes public GitHub repositories. Private repository access requires supplying a `GITHUB_TOKEN` with repository read scope in `.env`.
- **Large Repositories**: Repositories containing tens of thousands of files are summarized using the top-level tree hierarchy and primary manifest files to operate within token limits.
- **Static Ingestion**: Analysis is performed statically based on repository structure, manifests, and source files; runtime execution profiling is not performed.

---

## Deployment (Vercel)

DevLens AI is configured for deployment on Vercel:

1. Import the repository into your Vercel dashboard.
2. In Project Settings, add the environment variable:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `GITHUB_TOKEN` (optional): To avoid unauthenticated GitHub rate limits.
3. Vercel automatically runs `npm run build` to generate the static frontend in `dist/` and deploys the backend API through the serverless function handler in `api/index.js`.
4. The `vercel.json` configuration routes API traffic to `/api` and serves the single-page application from `dist/` with client-side fallback.

---

## Roadmap

- Extended manifest support for additional package managers (Elixir mix, Swift Package Manager, Gradle Kotlin DSL).
- In-memory AST symbol extraction for function and class relationship graphing.
- Exportable architecture reports in Markdown and PDF formats.
- Integration with local repository paths via local CLI invocation.

---

## Security

- API keys and secrets are processed strictly server-side and are never sent to or exposed in the client bundle.
- Cross-Origin Resource Sharing (CORS) is enabled only for API endpoints.
- Secret files (`.env`, `.env.*`) are gitignored by default.

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/improvement`).
3. Commit your changes (`git commit -m "Add feature improvement"`).
4. Push to the branch (`git push origin feature/improvement`).
5. Open a Pull Request.

Please ensure that changes maintain strict grounding rules, avoid extraneous dependencies, and adhere to the project's styling and linting standards.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
