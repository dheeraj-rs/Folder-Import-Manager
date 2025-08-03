'use client';

import { useState, useRef } from 'react';
import { ProjectFileItem, ProjectType } from './types/project';
import { DEFAULT_NEXT_JS_FILES } from './data/templates';
import ImportArea from './components/ImportArea';
import ProjectTypeModal from './components/ProjectTypeModal';
import ProjectsList from './components/ProjectsList';
import FileTree from './components/FileTree';
import Sidebar from './components/Sidebar';

export default function Home() {
  const [projects, setProjects] = useState<{[key: string]: ProjectFileItem[]}>({});
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<ProjectFileItem | null>(null);
  const [showProjectTypeModal, setShowProjectTypeModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const buildFileStructure = async (files: FileList): Promise<ProjectFileItem[]> => {
    const fileMap = new Map<string, ProjectFileItem>();
    const rootItems: ProjectFileItem[] = [];

    // Convert FileList to array and sort by path
    const fileArray = Array.from(files).sort((a, b) => a.webkitRelativePath.localeCompare(b.webkitRelativePath));

    for (const file of fileArray) {
      const path = file.webkitRelativePath;
      const pathParts = path.split('/');
      
      // Skip the root folder name (first part)
      const relativeParts = pathParts.slice(1);
      
      if (relativeParts.length === 0) continue;

      let currentPath = '';
      let currentParent: ProjectFileItem[] = rootItems;

      // Create folder structure
      for (let i = 0; i < relativeParts.length - 1; i++) {
        const folderName = relativeParts[i];
        currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;
        
        let folder = fileMap.get(currentPath);
        if (!folder) {
          folder = {
            id: `folder-${currentPath}-${Date.now()}`,
            name: folderName,
            type: 'folder',
            children: [],
            saved: true
          };
          fileMap.set(currentPath, folder);
          currentParent.push(folder);
        }
        currentParent = folder.children!;
      }

      // Add the file
      const fileName = relativeParts[relativeParts.length - 1];
      const fullPath = relativeParts.join('/');
      
      try {
        const content = await readFileAsText(file);
        const fileItem: ProjectFileItem = {
          id: `file-${fullPath}-${Date.now()}`,
          name: fileName,
          type: 'file',
          content: content,
          extension: fileName.split('.').pop(),
          saved: true
        };
        
        currentParent.push(fileItem);
      } catch (error) {
        console.error(`Error reading file ${fileName}:`, error);
        // Add file without content if reading fails
        const fileItem: ProjectFileItem = {
          id: `file-${fullPath}-${Date.now()}`,
          name: fileName,
          type: 'file',
          content: 'Error reading file content',
          extension: fileName.split('.').pop(),
          saved: true
        };
        currentParent.push(fileItem);
      }
    }

    return rootItems;
  };

  const handleFilesImport = async (files: FileList, projectType: ProjectType) => {
    try {
      const fileStructure = await buildFileStructure(files);
      const projectName = `${projectType}-project-${Date.now()}`;

      setProjects(prev => ({
        ...prev,
        [projectName]: fileStructure
      }));

      setSelectedProject(projectName);
      setShowProjectTypeModal(false);
      setPendingFiles(null);
    } catch (error) {
      console.error('Error importing files:', error);
      alert('Error importing files. Please try again.');
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = reject;
      
      // Handle different file types
      if (file.type.startsWith('text/') || 
          file.name.endsWith('.js') || 
          file.name.endsWith('.jsx') || 
          file.name.endsWith('.ts') || 
          file.name.endsWith('.tsx') || 
          file.name.endsWith('.css') || 
          file.name.endsWith('.html') || 
          file.name.endsWith('.json') || 
          file.name.endsWith('.md') || 
          file.name.endsWith('.txt') ||
          file.name.endsWith('.yml') ||
          file.name.endsWith('.yaml') ||
          file.name.endsWith('.xml') ||
          file.name.endsWith('.svg')) {
        reader.readAsText(file);
      } else {
        // For binary files, just resolve with a placeholder
        resolve(`[Binary file: ${file.name}]`);
      }
    });
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPendingFiles(files);
      setShowProjectTypeModal(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    
    if (items) {
      const files: File[] = [];
      const promises: Promise<void>[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            promises.push(traverseFileTree(entry, '', files));
          }
        }
      }

      Promise.all(promises).then(() => {
        if (files.length > 0) {
          // Create a FileList-like object
          const fileList = createFileList(files);
          setPendingFiles(fileList);
          setShowProjectTypeModal(true);
        }
      });
    }
  };

  const traverseFileTree = (item: any, path: string, files: File[]): Promise<void> => {
    return new Promise((resolve) => {
      if (item.isFile) {
        item.file((file: File) => {
          // Add webkitRelativePath property
          Object.defineProperty(file, 'webkitRelativePath', {
            value: path + file.name,
            writable: false
          });
          files.push(file);
          resolve();
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries((entries: any[]) => {
          const promises = entries.map(entry => 
            traverseFileTree(entry, path + item.name + '/', files)
          );
          Promise.all(promises).then(() => resolve());
        });
      } else {
        resolve();
      }
    });
  };

  const createFileList = (files: File[]): FileList => {
    const fileList = {
      length: files.length,
      item: (index: number) => files[index] || null,
      [Symbol.iterator]: function* () {
        for (const file of files) {
          yield file;
        }
      }
    };

    // Add indexed properties
    files.forEach((file, index) => {
      (fileList as any)[index] = file;
    });

    return fileList as FileList;
  };

  const loadTemplate = (projectType: ProjectType) => {
    const projectName = `${projectType}-template-${Date.now()}`;
    let templateFiles: ProjectFileItem[] = [];

    switch (projectType) {
      case 'nextjs':
        templateFiles = [...DEFAULT_NEXT_JS_FILES];
        break;
      case 'vite':
        templateFiles = createViteTemplate();
        break;
      case 'html':
        templateFiles = createHtmlTemplate();
        break;
      case 'astro':
        templateFiles = createAstroTemplate();
        break;
    }

    setProjects(prev => ({
      ...prev,
      [projectName]: templateFiles
    }));

    setSelectedProject(projectName);
  };

  const createViteTemplate = (): ProjectFileItem[] => [
    {
      id: 'vite-package-json',
      name: 'package.json',
      type: 'file',
      extension: 'json',
      content: JSON.stringify({
        name: 'vite-project',
        private: true,
        version: '0.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview'
        },
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0'
        },
        devDependencies: {
          vite: '^5.0.0',
          '@vitejs/plugin-react': '^4.2.0'
        }
      }, null, 2),
      saved: true
    },
    {
      id: 'vite-config',
      name: 'vite.config.js',
      type: 'file',
      extension: 'js',
      content: 'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\n\nexport default defineConfig({\n  plugins: [react()],\n});',
      saved: true
    }
  ];

  const createHtmlTemplate = (): ProjectFileItem[] => [
    {
      id: 'html-index',
      name: 'index.html',
      type: 'file',
      extension: 'html',
      content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>HTML Project</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <h1>Hello World</h1>\n    <script src="script.js"></script>\n</body>\n</html>',
      saved: true
    },
    {
      id: 'html-style',
      name: 'style.css',
      type: 'file',
      extension: 'css',
      content: 'body {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n    background-color: #f0f0f0;\n}\n\nh1 {\n    color: #333;\n    text-align: center;\n}',
      saved: true
    }
  ];

  const createAstroTemplate = (): ProjectFileItem[] => [
    {
      id: 'astro-package-json',
      name: 'package.json',
      type: 'file',
      extension: 'json',
      content: JSON.stringify({
        name: 'astro-project',
        type: 'module',
        version: '0.0.1',
        scripts: {
          dev: 'astro dev',
          start: 'astro dev',
          build: 'astro build',
          preview: 'astro preview'
        },
        dependencies: {
          astro: '^4.0.0'
        }
      }, null, 2),
      saved: true
    },
    {
      id: 'astro-config',
      name: 'astro.config.mjs',
      type: 'file',
      extension: 'mjs',
      content: 'import { defineConfig } from "astro/config";\n\nexport default defineConfig({});',
      saved: true
    }
  ];

  const exportProjectStructure = (projectName: string) => {
    const project = projects[projectName];
    if (!project) return;

    const dataStr = JSON.stringify(project, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${projectName}-structure.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="app-container">
      <Sidebar 
        projects={projects}
        selectedProject={selectedProject}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onProjectSelect={setSelectedProject}
        onLoadTemplate={loadTemplate}
      />

      <main className="main-content">
        <div className="header">
          <h1>Folder Import Manager</h1>
          <p>Import and organize your project folders with intelligent structure recognition</p>
        </div>

        {!selectedProject ? (
          <>
            <div className="import-section">
              <ImportArea onImportClick={handleImportClick} onDrop={handleDrop} />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                webkitdirectory=""
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
            </div>

            <ProjectsList 
              projects={projects}
              onProjectSelect={setSelectedProject}
              onExportProject={exportProjectStructure}
            />
          </>
        ) : (
          <FileTree
            files={projects[selectedProject] || []}
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            projectName={selectedProject}
            onBack={() => setSelectedProject(null)}
            onExportProject={() => exportProjectStructure(selectedProject)}
          />
        )}

        {showProjectTypeModal && (
          <ProjectTypeModal
            onSelectType={(type) => {
              if (pendingFiles) {
                handleFilesImport(pendingFiles, type);
              }
            }}
            onClose={() => {
              setShowProjectTypeModal(false);
              setPendingFiles(null);
            }}
          />
        )}
      </main>
    </div>
  );
}