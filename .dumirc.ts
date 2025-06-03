import { defineConfig } from 'dumi';

const repo = 'rc-keep-alive-dom';

export default defineConfig({
  outputPath: 'docs-dist',
  logo:
    process.env.NODE_ENV === 'production' ? `/${repo}/logo.png` : '/logo.png',
  base: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
  publicPath: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
  themeConfig: {
    name: 'keep-alive',
  },
});
