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
| `GEMINI_API_KEY` | Yes (for AI) | None | Google Gemini API key used for architectural summaries and Q&A. |
| `GEMINI_MODEL_CHAIN` | No | `gemini-3.8-flash,gemini-3.6-flash,gemini-3.5-flash-lite` | Comma-separated ordered fallback chain of text-generation Gemini models. |
| `GEMINI_MODEL` | No | None | Optional primary Gemini model override (prepended to the failover chain). |
| `GEMINI_REQUEST_TIMEOUT_MS` | No | `12000` | Per-attempt timeout in milliseconds before failing over to the next Gemini model. |
| `GEMINI_OVERALL_DEADLINE_MS` | No | `28000` | Total time budget across all failover attempts for a single request. |
| `JSON_BODY_LIMIT` | No | `256kb` | Global Express JSON body size limit for standard API endpoints. |
| `AI_BODY_LIMIT` | No | `1mb` | Route-specific JSON body limit for `/api/ai/*` and `/api/memory/ingest`. |
| `GITHUB_TOKEN` | No | None | Optional GitHub Personal Access Token to increase API rate limits. |
| `PORT` | No | `5000` | Local HTTP server port. |
| `NEO4J_URI` | Yes (for Graph Memory) | None | Neo4j Bolt/Aura connection URI (`neo4j+s://...` or `bolt://...`). |
| `NEO4J_USERNAME` | Yes (for Graph Memory) | None | Neo4j database username. |
| `NEO4J_PASSWORD` | Yes (for Graph Memory) | None | Neo4j database password (processed strictly server-side). |
| `NEO4J_DATABASE` | No | `neo4j` | Target Neo4j database name (or Aura instance database ID). |
| `AURA_INSTANCEID` | No | None | Optional Neo4j Aura instance identifier metadata. |
| `AURA_INSTANCENAME` | No | `Free instance` | Optional human-readable Neo4j Aura instance label. |
| `HEALTH_CHECK_TOKEN` | No | None | Optional secret header (`x-health-token`) to protect `/api/health/neo4j`. |

Note: Never commit `.env` to source control. The `.gitignore` configuration explicitly excludes `.env` and `.env.*`. If Neo4j is not configured, repository analysis and static Q&A continue to function in graceful fallback mode.

---

## Navigation & Split-Screen Neo4j Project Memory Workspace

DevLens AI uses a streamlined 4-tab navigation bar (**Overview**, **Project Memory & Graph**, **Architecture**, **Ask Codebase**). The standalone `Files` tab was removed to eliminate duplication; full repository file search and tree inspection are integrated directly into the **Project Memory & Graph** workspace.

### Desktop Split-Screen Layout (`ProjectMemoryTab.jsx`)
- **Left Panel (7 cols): Interactive Neo4j Graph Explorer & Integrated File Tree**
  - Renders actual Neo4j nodes (`Repository`, `Component`, `File`, `Function`/`Class`, `Bug`, `Fix`, `TechnicalDecision`, `Commit`, `Test`) and directed relationships (`COMPONENT_DEPENDS_ON_COMPONENT`, `COMPONENT_CONTAINS_FILE`, `FILE_DEFINES_SYMBOL`, `SYMBOL_CALLS_SYMBOL`, `BUG_AFFECTS_COMPONENT`, `BUG_AFFECTS_FILE`, `FIX_RESOLVES_BUG`, `DECISION_AFFECTS_COMPONENT`, `TEST_COVERS_SYMBOL`, `COMMIT_CHANGED_FILE`).
  - Visually distinguishes **source-derived** entities (solid borders) from **recorded project memory** (`Bug`, `Fix`, `TechnicalDecision` with dashed borders).
  - Supports zoom in/out, drag-to-pan, fit/reset view, search by entity name/path/description, node-type filter chips, 1-hop neighborhood highlighting, and clickable relationship edges.
  - Includes a collapsible **Integrated Repository File & Directory Explorer** that highlights files directly in the Neo4j graph when clicked.
- **Right Panel (5 cols): Selected Entity & Relationship Inspector**
  - Displays real entity attributes, type badge, source vs. recorded-memory badge, provenance (`filePath`, `startLine`–`endLine`, `commitSha`, `parserPrecision`), and clickable 1-hop incoming/outgoing relationships.
  - Provides **Investigate in Ask Codebase** to transfer the selected graph node and its provenance into Ask Codebase with a pre-filled, editable grounded question.

---

## Automatic AI Summary, Contextual Q&A & Compact Payload Protection

1. **Automatic Repository Summary**:
   - Analyzing a repository automatically generates the executive Gemini architecture summary in the **Overview** tab without requiring a manual button click.
   - Summaries are cached in `sessionStorage` per repository (`devlens_summary_<owner>/<repo>`) and guarded by an in-flight ref so switching tabs or re-rendering never triggers duplicate Gemini calls.
2. **Repository-Aware Ask Codebase Suggestions & Selected-Node Investigation**:
   - Sample prompts are dynamically generated (`generateContextualSuggestions`) strictly from the active repository's Neo4j project memory (`bugsAndFixes`, `decisions`, `componentDependencies`, `symbols`) and static analysis (`entryPoints`, `testFiles`, `classifiedDirectories`, `dependencies`).
   - Selecting any node in the Neo4j Graph Inspector and clicking **Investigate in Ask Codebase** pre-fills an editable, entity-grounded prompt (`buildEntityInvestigationPrompt`) and passes `focusEntity` context to `/api/ai/ask`.
3. **Compact Payload & `413 Payload Too Large` Protection**:
   - `buildCompactAnalysisPayload` strips the nested UI `structure.tree` hierarchy and bounds `aiContextReady.filePaths` before calling `/api/ai/summary` and `/api/ai/ask`, cutting request sizes by >85% on large repositories while preserving all fields consumed by `AIProvider.buildCompactContext`.
   - Express enforces route-specific body limits (`AI_BODY_LIMIT`, default `1mb`) and returns a structured JSON `413 Payload Too Large` (`code: 'PAYLOAD_TOO_LARGE'`) response instead of an unhandled stack trace if a request exceeds the limit.

---

## Gemini Multi-Model Failover Engine

`AIProvider` (`server/ai/provider.js`) implements resilient, multi-model failover across a configurable chain of current text-generation Gemini models:

1. **Primary**: `gemini-3.8-flash`
2. **Secondary**: `gemini-3.6-flash`
3. **Tertiary**: `gemini-3.5-flash-lite`

- **Retryable vs. Permanent Classification**:
  - Automatically fails over to the next model in the chain on HTTP `429` (rate limit / quota exhaustion), `500`/`502`/`503`/`504` (transient server errors), per-attempt timeouts (`GEMINI_REQUEST_TIMEOUT_MS`), network errors, unavailable/unsupported model errors (`404` or model-specific `400`), and empty/malformed responses.
  - Immediately aborts without retrying on permanent configuration or request errors (missing `GEMINI_API_KEY`, `401`/`403` invalid API key, or non-model `400` payload validation errors).
- **Observability & Redaction**:
  - Preserves identical `systemInstruction`, repository context, and Neo4j graph evidence across fallback attempts.
  - Returns `{ model, primaryModel, fallbackUsed, attempts }` metadata to the API/UI and redacts API keys from all logs and error messages.

---

## Neo4j Project Memory Graph Schema

DevLens AI models repository architecture, code symbols, commits, and debugging history in Neo4j using repository-scoped deterministic identifiers (`id`) with uniqueness constraints and property indexes:

- **Nodes**:
  - `:Repository` (`<owner>/<repo>`)
  - `:Component` (`<repo>::component::<path>`)
  - `:File` (`<repo>::file::<path>`)
  - `:Symbol` (`:Function` / `:Class` for supported JS/TS files with 1-indexed `startLine`–`endLine`; `parserPrecision: 'lexical-brace-js-ts'`)
  - `:Test` (`<repo>::test::<filePath>::<slug>`)
  - `:Commit` (`<repo>::commit::<sha>`)
  - `:Bug` (`<repo>::bug::<slug>`)
  - `:Fix` (`<repo>::fix::<slug>`)
  - `:TechnicalDecision` (`<repo>::decision::<slug>`)
- **Relationships**:
  - `(:Repository)-[:REPOSITORY_CONTAINS_FILE]->(:File)`
  - `(:Repository)-[:REPOSITORY_HAS_COMPONENT]->(:Component)`
  - `(:Component)-[:COMPONENT_CONTAINS_FILE]->(:File)`
  - `(:File)-[:FILE_DEFINES_SYMBOL]->(:Symbol)`
  - `(:Symbol)-[:SYMBOL_CALLS_SYMBOL]->(:Symbol)`
  - `(:Component)-[:COMPONENT_DEPENDS_ON_COMPONENT]->(:Component)`
  - `(:Commit)-[:COMMIT_CHANGED_FILE]->(:File)`
  - `(:Commit)-[:COMMIT_CHANGED_SYMBOL]->(:Symbol)`
  - `(:Bug)-[:BUG_AFFECTS_COMPONENT]->(:Component)` & `(:Bug)-[:BUG_AFFECTS_FILE]->(:File)`
  - `(:Fix)-[:FIX_RESOLVES_BUG]->(:Bug)` & `(:Fix)-[:FIX_APPLIED_IN_COMMIT]->(:Commit)`
  - `(:TechnicalDecision)-[:DECISION_AFFECTS_COMPONENT]->(:Component)`
  - `(:Test)-[:TEST_COVERS_SYMBOL]->(:Symbol)`

---

## Gemini + Neo4j Request Flow & API Endpoints

```
Developer Question / Action
       |
       v
1. Express API Route (/api/ai/ask or /api/memory/*)
       |
       +---> 2. Fixed Parameterized Cypher Retrieval (server/memory/retrieval.js)
       |        - Queries Neo4j for matching Bugs, Fixes, TechnicalDecisions,
       |          ComponentDependencies, Symbols (startLine-endLine), and Commits
       |        - Enforces bounded result limits (clamped 1..25) & explicit session close
       |
       +---> 3. Compact Static Scan Evidence + Multi-Model Failover (server/ai/provider.js)
                - Combines verified manifests, directory roles, entry points, and focusEntity
                - Injects formatted Neo4j Graph Evidence Markdown
                - Executes Gemini failover chain (gemini-3.8-flash -> gemini-3.6-flash -> gemini-3.5-flash-lite):
                  1) ### Confirmed Facts
                  2) ### Inferred Causes & Uncertainty
                  3) ### Recommended Next Debugging Steps
```

| Method & Endpoint | Purpose |
| :--- | :--- |
| `POST /api/analyze` | Analyzes a GitHub repository and idempotently ingests its graph into Neo4j (`UNWIND ... MERGE`). |
| `GET /api/memory/overview?repo=owner/repo` | Returns Neo4j connection status, entity/relationship counts, stored decisions, bugs/fixes, dependencies, symbols, and interactive Graph Explorer nodes/edges. |
| `POST /api/memory/record` | Records a Technical Decision (`type: 'decision'`) or Bug + Fix (`type: 'bug_fix'`) with component, file, and commit provenance in Neo4j. |
| `GET /api/memory/context?repo=owner/repo&q=...` | Retrieves bounded Neo4j project memory evidence for an investigation query. |
| `POST /api/memory/ingest` | Explicitly ingests or refreshes an analyzed repository payload in Neo4j. |
| `POST /api/ai/ask` | Combines retrieved Neo4j project memory with verified repository scan context and queries Google Gemini with model failover. |
| `POST /api/ai/summary` | Automatically generates a grounded executive architectural summary via Google Gemini with model failover. |
| `GET /api/health/neo4j` | Protected server-side Neo4j connectivity check (never exposes credentials or URIs). |

---

## Demonstrating the Flagship Scenario: "The Bug That Came Back"

1. **Analyze a Repository**:
   - Start the app (`npm run dev`) and analyze any repository (e.g., `https://github.com/shubhamranswal/devlens-ai` or `https://github.com/expressjs/express`).
   - Observe the **AI Architecture Summary** automatically generating on the **Overview** tab with its active Gemini model badge.
2. **Explore the Split-Screen Neo4j Workspace**:
   - Click the **Project Memory & Graph** tab to open the split-screen Neo4j Graph Explorer (left) and Entity & Relationship Inspector (right).
   - Pan, zoom, filter by node type, or click any node/relationship edge to inspect its provenance and connected neighbors.
3. **Record a Bug + Fix and a Technical Decision**:
   - In the **Project Memory & Graph** tab, click **+ Record Memory in Neo4j**.
   - Select **Bug & Fix**, enter:
     - **Bug Title**: `Authentication API 401 error on valid tokens due to clock skew`
     - **Bug Description**: `Token verification rejected newly issued JWTs when gateway clock drifted by 5-15 seconds`
     - **Fix Summary**: `Added 30-second clock skew grace window in token verification`
     - **Component**: `server` | **File**: `server/index.js` | **Commit**: `9f8e7d6`
   - Switch to **Technical Decision** and save a decision affecting `server` (e.g., `Enforce strict stateless JWT exp claim validation`).
4. **Investigate a Selected Node in Ask Codebase**:
   - Click the newly recorded `:Bug` or `:Component` node in the **Neo4j Graph Explorer**, then click **Investigate in Ask Codebase** in the right-hand inspector.
   - Verify that **Ask Codebase** opens with the **Investigating Selected Graph Node** banner, a pre-filled editable question grounded in that entity, and dynamic repository-scoped prompt suggestions.
   - Confirm that Gemini returns a structured answer (`Confirmed Facts`, `Inferred Causes & Uncertainty`, `Recommended Next Debugging Steps`) alongside the **Retrieved Neo4j Project Memory Evidence** cards and model/failover metadata.
5. **Verify Persistence**:
   - Refresh the browser page (`F5`). Confirm that the active repository, cached summary, and all recorded decisions, bugs, fixes, and graph relationships reload cleanly.

---

## Running Tests

```bash
# Run fast unit, payload-limit, contextual Q&A, and 12-case Gemini failover tests (no external network required)
npm run test:unit

# Run live Neo4j Aura + Gemini integration tests (requires .env credentials)
npm run test:integration

# Run all test suites
npm test
```

---

## AI Grounding

DevLens AI is engineered to minimize hallucinations:

1. **Context Constrained**: All prompts are injected with verified scan artifacts including exact file paths, directory roles, parsed manifests, language statistics, README excerpts, and retrieved Neo4j graph records.
2. **Strict System Instructions**: The AI engine is instructed to cite only existing files/commits/symbols and to explicitly distinguish **Confirmed Facts** from **Inferred Causes & Uncertainty**.
3. **Fixed Parameterized Cypher**: The model never generates or executes arbitrary Cypher; all Neo4j reads and writes use fixed parameterized templates with bounded limits.

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

<img src="https://komarev.com/ghpvc/?username=shubhamranswal&color=00000000&label=" width="1" height="1" />