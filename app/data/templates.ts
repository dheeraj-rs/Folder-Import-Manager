import { ProjectFileItem } from '../types/project';

export const DEFAULT_NEXT_JS_FILES: ProjectFileItem[] = [
  {
    id: 'app',
    name: 'app',
    type: 'folder',
    children: [
      {
        id: 'globals-css',
        name: 'globals.css',
        type: 'file',
        extension: 'css',
        content: `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  margin: 0;
  padding: 0;
  line-height: 1.6;
  color: #333;
  background-color: #fff;
}

* {
  box-sizing: border-box;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  line-height: 1.25;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.min-h-screen {
  min-height: 100vh;
}

.text-center {
  text-align: center;
}

.p-24 {
  padding: 6rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-bold {
  font-weight: 700;
}`,
        parentId: 'app',
        saved: true,
      },
      {
        id: 'layout-tsx',
        name: 'layout.tsx',
        type: 'file',
        extension: 'tsx',
        content: `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js App",
  description: "A Next.js application with custom CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
        parentId: 'app',
        saved: true,
      },
      {
        id: 'page-tsx',
        name: 'page.tsx',
        type: 'file',
        extension: 'tsx',
        content: `export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="container text-center">
        <h1 className="text-2xl font-bold mb-4">
          Welcome to Next.js!
        </h1>
        <p>
          Get started by editing <code>app/page.tsx</code>
        </p>
      </div>
    </main>
  );
}`,
        parentId: 'app',
        saved: true,
      },
    ],
    saved: true,
  },
  {
    id: 'components',
    name: 'components',
    type: 'folder',
    children: [],
    saved: true,
  },
  {
    id: 'styles',
    name: 'styles',
    type: 'folder',
    children: [
      {
        id: 'components-css',
        name: 'components.css',
        type: 'file',
        extension: 'css',
        content: `/* Component styles */
.button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.button:hover {
  background-color: #0056b3;
}

.button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}`,
        parentId: 'styles',
        saved: true,
      },
    ],
    saved: true,
  },
  {
    id: 'public',
    name: 'public',
    type: 'folder',
    children: [
      {
        id: 'next-svg',
        name: 'next.svg',
        type: 'file',
        extension: 'svg',
        content: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.7h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/></svg>',
        parentId: 'public',
        saved: true,
      },
    ],
    saved: true,
  },
  {
    id: 'package-json',
    name: 'package.json',
    type: 'file',
    extension: 'json',
    content: `{
  "name": "nextjs-custom-css",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.0.4"
  }
}`,
    saved: true,
  },
  {
    id: 'next-config-js',
    name: 'next.config.js',
    type: 'file',
    extension: 'js',
    content: `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig`,
    saved: true,
  },
];