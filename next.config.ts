import type { NextConfig } from 'next';

const isStaticExport: boolean = false;

const nextConfig: NextConfig = {
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  env: {
    BUILD_STATIC_EXPORT: String(isStaticExport),
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    }
  },
  ...(isStaticExport ? {
    output: 'export',
  } : {}),
};

export default nextConfig;
