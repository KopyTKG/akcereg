import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
 baseDirectory: __dirname,
 recommendedConfig: js.configs.recommended,
 allConfig: js.configs.all,
})

const settings = [
 { files: ['**/*.{jsx,ts,tsx}'] },
 {
  files: ['**/*.{js,cjs}'],
  languageOptions: {
   sourceType: 'commonjs',
   ecmaVersion: 12,
  },
 },
 {
  languageOptions: {
   ecmaVersion: 12,
   globals: globals.browser,
  },
  rules: {
   'prettier/prettier': 'error',
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
  'plugin:prettier/recommended',
  'plugin:@typescript-eslint/eslint-recommended',
 ),
 eslintPluginPrettierRecommended,
]

export default settings
