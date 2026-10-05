import React from 'react';
import { Server, Layout, Container, Database, Wrench, PackageCheck } from 'lucide-react';

export default function TechStackGrid({ techStack, frameworks }) {
  const categories = [
    {
      title: 'Backend Technologies',
      icon: Server,
      items: techStack.backend,
      emptyText: 'No dedicated backend manifest detected'
    },
    {
      title: 'Frontend & UI',
      icon: Layout,
      items: techStack.frontend,
      emptyText: 'No dedicated frontend manifest detected'
    },
    {
      title: 'DevOps & Infrastructure',
      icon: Container,
      items: techStack.devops,
      emptyText: 'No container or CI/CD configs detected'
    },
    {
      title: 'Database & Persistence',
      icon: Database,
      items: techStack.database,
      emptyText: 'No ORM or schema files detected'
    },
    {
      title: 'Tooling & Config',
      icon: Wrench,
      items: techStack.config,
      emptyText: 'Standard configuration'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const hasItems = cat.items && cat.items.length > 0;

          return (
            <div
              key={cat.title}
              className="rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200">{cat.title}</h3>
                </div>

                {hasItems ? (
                  <div className="space-y-2 mt-2">
                    {cat.items.map((item) => (
                      <div
                        key={item.name}
                        className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">{item.name}</span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Detected
                          </span>
                        </div>
                        {item.reason && (
                          <p className="text-xs text-slate-400 mt-1">{item.reason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic mt-2">{cat.emptyText}</p>
                )}
              </div>
            </div>
          );
        })}

        {/* Frameworks & Libraries Card */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-lg flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <PackageCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200">Frameworks & Libraries</h3>
            </div>

            {frameworks && frameworks.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {frameworks.map((f) => (
                  <div
                    key={f.name}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/70 flex items-center gap-2"
                  >
                    <span className="text-xs font-semibold text-slate-200">{f.name}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded">
                      {f.category}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic mt-2">
                No major frameworks detected in top manifest files
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
