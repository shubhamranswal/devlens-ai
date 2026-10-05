import { parseGitHubUrl, fetchGitHubRepoData } from './github.js';
import { detectTechnologies } from './techDetector.js';
import { detectFrameworks } from './frameworkDetector.js';
import { analyzeStructure } from './structureAnalyzer.js';
import { detectEntryPoints } from './entryPointDetector.js';
import { mapArchitecture } from './architectureMapper.js';
import { generateObservations } from './observations.js';

export async function analyzeRepository(repoUrl, options = {}) {
  const startTime = Date.now();

  // 1. Ingestion Phase
  const parsed = parseGitHubUrl(repoUrl);
  const scan = await fetchGitHubRepoData(parsed, options.token);

  // 2. Static & Heuristic Analysis Phase
  const techStack = detectTechnologies(scan);
  const frameworks = detectFrameworks(scan);
  const structure = analyzeStructure(scan);
  const entryPoints = detectEntryPoints(scan);
  const architecture = mapArchitecture(scan, techStack, frameworks, structure, entryPoints);
  const observations = generateObservations(scan, techStack, frameworks);

  const durationMs = Date.now() - startTime;

  return {
    repository: scan.repoInfo,
    metrics: {
      totalFiles: scan.totalFiles,
      totalDirectories: scan.totalDirectories,
      topExtensions: Object.entries(scan.extensions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([ext, count]) => ({ ext, count })),
      analysisTimeMs: durationMs
    },
    techStack,
    frameworks,
    projectType: architecture.projectType,
    architecture: {
      pattern: architecture.architecturePattern,
      description: architecture.description,
      components: architecture.components,
      entryPoints
    },
    structure: {
      classifiedDirectories: structure.classifiedDirectories,
      tree: structure.tree
    },
    observations,
    // Context prepared for subsequent AI stage (README snippet, manifests & file list)
    aiContextReady: {
      hasReadme: Boolean(scan.manifests['README.md'] || scan.manifests['readme.md']),
      manifestFiles: Object.keys(scan.manifests),
      filePaths: scan.files.map(f => f.path),
      sampleReadmeExcerpt: (scan.manifests['README.md'] || scan.manifests['readme.md'] || '').slice(0, 1500)
    }
  };
}
