// Ambient declaration so TypeScript allows side-effect CSS imports
// (Next.js handles the actual bundling). Tanpa ini, editor nge-throw TS2882
// pada `import './globals.css'`.
declare module '*.css';
