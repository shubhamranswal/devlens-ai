import React, { useState } from 'react';
import { 
  FolderTree, 
  Folder, 
  FolderOpen, 
  File, 
  ChevronRight, 
  ChevronDown, 
  Tag, 
  Layers
} from 'lucide-react';

function TreeNode({ node, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const isDirectory = node.type === 'directory';

  return (
    <div className="text-xs font-mono">
      <div
        onClick={() => isDirectory && setIsOpen(!isOpen)}
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-slate-800/60 transition-colors cursor-pointer ${
          isDirectory ? 'text-slate-200 font-semibold' : 'text-slate-400'
        }`}
        style={{ paddingLeft: `${depth * 1.25 + 0.5}rem` }}
      >
        {isDirectory ? (
          <>
            <span className="text-slate-500">
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </span>
            {isOpen ? (
              <FolderOpen className="w-4 h-4 text-indigo-400 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-indigo-400 shrink-0" />
            )}
            <span className="text-slate-200">{node.name}</span>
            {node.fileCount > 0 && (
              <span className="text-[10px] text-slate-500 font-sans font-normal ml-1">
                ({node.fileCount} items)
              </span>
            )}
            {node.role && (
              <span className="ml-auto text-[10px] font-sans font-medium px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {node.role}
              </span>
            )}
          </>
        ) : (
          <>
            <span className="w-3.5" />
            <File className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-slate-300 font-normal">{node.name}</span>
          </>
        )}
      </div>

      {isDirectory && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DirectoryTree({ structure }) {
  const [activeTab, setActiveTab] = useState('classified'); // 'classified' | 'tree'
  const { classifiedDirectories, tree } = structure;

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-indigo-400" />
            Project Structure & Organization
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Classified directory roles and repository hierarchy
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('classified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'classified'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Classified Directories
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tree')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tree'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Explorer Tree
          </button>
        </div>
      </div>

      {/* Content based on tab */}
      {activeTab === 'classified' ? (
        classifiedDirectories && classifiedDirectories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {classifiedDirectories.map((dir) => (
              <div
                key={dir.path}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-indigo-400" />
                    <span className="font-mono text-xs font-bold text-slate-200">{dir.path}</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-700/60 text-indigo-300 border border-slate-600">
                    {dir.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                  {dir.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic p-4 text-center">
            No standard structured directory names identified
          </p>
        )
      ) : (
        <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-4 max-h-[460px] overflow-y-auto">
          {tree && tree.length > 0 ? (
            tree.map((node) => <TreeNode key={node.path} node={node} />)
          ) : (
            <p className="text-xs text-slate-500 italic text-center">Empty directory tree</p>
          )}
        </div>
      )}
    </div>
  );
}
