import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
 baseDirectory: __dirname,
 recommendedConfig: js.configs.recommended,
 allConfig: js.configs.all,
})

const isProd = process.env.NODE_ENV === 'production'

const settings = [
 { files: ['**/*.{jsx,ts,tsx}'] },
 {
  files: ['**/*.{js,cjs}'],
  languageOptions: {
   sourceType: 'commonjs',
   ecmaVersion: 12, // Enable ES2021
  },
 },
 {
  languageOptions: {
   ecmaVersion: 12, // Enable ES2021 for other files
   globals: globals.browser,
  },
  rules: {
   // Disable Prettier in production
   'prettier/prettier': isProd ? 'off' : 'error',
   // You can add more rules to disable in production if needed
  },
 },
 {
  ignores: ['src/components/ui/*.{ts,tsx}', 'src/hooks/*.{ts,js}', '.next/', 'node_modules/'],
 },
 ...compat.extends(
  'next/core-web-vitals',
  'plugin:react/recommended',
  'plugin:react/jsx-runtime',
  'plugin:react-hooks/recommended',
  'eslint:recommended',
  'plugin:@typescript-eslint/eslint-recommended',
 ),
]

export default settings
