# DevLens AI 🔍⚡

**DevLens AI** is an intelligent web application designed to help developers immediately understand any unfamiliar GitHub codebase through automated repository ingestion, technology detection, architectural mapping, and directory structure classification.

Building upon the foundations of the original [DevLens](https://github.com/shubhamranswal/devlens) CLI analyzer, **DevLens AI** modernizes repository scanning with single-shot Git tree ingestion, deep manifest analysis, and a modular architecture ready for AI-powered architectural summaries and natural language codebase Q&A.

---

## 🚀 Key Features (v1.0 MVP)

1. **High-Speed GitHub Ingestion:**
   - Single-shot Git Trees API query pulls complete repository file graphs in a single request, avoiding rate-limiting pitfalls.
   - Raw manifest fetching for `package.json`, `go.mod`, `Cargo.toml`, `requirements.txt`, `pyproject.toml`, `pom.xml`, `Dockerfile`, etc.

2. **Multi-Ecosystem Technology Detection:**
   - Language breakdown with visual percentage distribution.
   - Categorized technology stack: **Backend**, **Frontend**, **DevOps & Infrastructure**, **Database & ORMs**, and **Configuration**.
   - Deep manifest inspection for libraries and frameworks (React, Next.js, Vue, Vite, Express, FastAPI, Django, Flask, Gin, Tokio, and more).

3. **Project Classification & Architecture Mapping:**
   - Heuristic classification: Fullstack Web App, Backend API Service, Command-Line Tool (CLI), Monorepo Workspace, Frontend SPA, or Library/SDK.
   - Inferred architecture patterns (e.g. *Service-Oriented REST / RPC Architecture*, *Command Dispatcher Architecture*, *Client-Server Fullstack*).
   - Component responsibility breakdown.

4. **Project Structure & Directory Classification:**
   - Automatically maps directory purposes (`API Endpoints`, `Core Source Root`, `UI Components`, `Test Suite`, `Data Models`, `Automation Scripts`, etc.).
   - Interactive Expandable Directory Explorer with item counts and hierarchy visualization.

5. **Application Entry Point Detection:**
   - Pinpoints primary execution entry points across Go, Python, Node/TypeScript, Rust, Java, and Docker.

6. **Engineering Observations & Health:**
   - Automated checks for Docker containerization, CI/CD pipelines (GitHub Actions), test suites, static type safety, and documentation hygiene.

7. **Modular AI Engine Interface (Ready for Phase 2):**
   - Clean abstraction layer ready to plug in Google Gemini (`@google/genai`) for multi-file neural reasoning, architecture explanations, and interactive chat Q&A.

---

## 🛠️ Project Architecture

```
devlens-ai/
├── server/
│   ├── index.js                  # Express server entry point & SPA fallback
│   ├── routes/
│   │   ├── analyze.js            # POST /api/analyze endpoint
│   │   └── ai.js                 # POST /api/ai/summary & /api/ai/ask endpoints
│   ├── analyzer/
│   │   ├── index.js              # Analyzer orchestration pipeline
│   │   ├── github.js             # High-speed GitHub Tree & Manifest ingestion
│   │   ├── techDetector.js       # Manifest-based technology stack detection
│   │   ├── frameworkDetector.js  # Framework & dependency parser
│   │   ├── structureAnalyzer.js  # Directory classification & hierarchy builder
│   │   ├── entryPointDetector.js # Multi-language entry point identification
│   │   ├── architectureMapper.js # Project type & architectural style inference
│   │   └── observations.js       # DevOps, testing & type safety observations
│   └── ai/
│       └── provider.js           # Pluggable LLM interface (Gemini / OpenAI)
├── client/
│   ├── index.html                # HTML entry
│   ├── src/
│   │   ├── main.jsx              # React root
│   │   ├── App.jsx               # Main application container
│   │   ├── index.css             # Tailwind CSS styles
│   │   └── components/
│   │       ├── Header.jsx        # Navigation & Branding
│   │       ├── RepoInput.jsx     # URL input with sample presets
│   │       ├── AnalysisProgress.jsx # Scanning pipeline visualizer
│   │       ├── AIPreview.jsx     # Preview & hook for AI Q&A
│   │       └── Dashboard/
│   │           ├── OverviewCard.jsx     # Repository metrics & language bar
│   │           ├── TechStackGrid.jsx    # Categorized technology cards
│   │           ├── ArchitectureView.jsx # Architecture pattern & entry points
│   │           ├── DirectoryTree.jsx    # Expandable explorer & directory roles
│   │           └── ObservationsList.jsx # Engineering health checks
├── dist/                         # Compiled production frontend
├── vite.config.js                # Vite build and dev configuration
└── package.json
```

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node.js v24)
- npm

### 2. Run the Application
To run the server and frontend together:
```bash
npm start
```
or for active development with Vite HMR:
```bash
npm run dev
```

Open your browser to:
```
http://localhost:5000
```

---

## 🗺️ Next Steps: Phase 2 (AI Intelligence)
- Wire Google Gemini API (`@google/genai`) into `server/ai/provider.js`.
- Enable deep natural language architecture summaries.
- Activate interactive multi-turn codebase Q&A with grounded file citations.
