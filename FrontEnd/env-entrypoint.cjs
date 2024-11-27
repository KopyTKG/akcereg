const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const envVars = ['NEXT_PUBLIC_BASE', 'API', 'BASE', 'NEXT_PUBLIC_TIME_GAP', 'STAG_SERVER']

function injectEnvVariables(content) {
 envVars.forEach((varName) => {
  const placeholder = `__${varName}__`
  const value = process.env[varName] || ''
  content = content.replace(new RegExp(placeholder, 'g'), value)
 })
 return content
}

function updateFile(filePath) {
 if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8')
  const updatedContent = injectEnvVariables(content)
  if (content !== updatedContent) {
   fs.writeFileSync(filePath, updatedContent, 'utf8')
   console.log(`Updated ${filePath}`)
  }
 }
}

function updateNextConfig() {
 updateFile(path.join(__dirname, 'next.config.js'))
}

function updateBuiltFiles() {
 const nextDir = path.join(__dirname, '.next')

 function walkDir(dir) {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
   const filePath = path.join(dir, file)
   if (fs.statSync(filePath).isDirectory()) {
    walkDir(filePath)
   } else if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.json')) {
    updateFile(filePath)
   }
  })
 }

 walkDir(nextDir)
 walkDir(__dirname)
}

function rebuildNextConfig() {
 console.log('Rebuilding Next.js configuration...')
 try {
  execSync('bun run build', { stdio: 'inherit' })
 } catch (error) {
  console.error('Failed to rebuild Next.js configuration:', error)
  // Continue execution even if rebuild fails
 }
}

// Inject environment variables before starting the server
updateNextConfig()
updateBuiltFiles()
//rebuildNextConfig()
//updateBuiltFiles()
