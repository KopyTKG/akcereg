'use client'

export function preventDevTools() {
 if (typeof window === 'undefined') return

 function preventDevToolsForChrome(e: KeyboardEvent) {
  // Chrome dev tools
  if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.keyCode === 73)) {
   e.preventDefault()
  }

  // Chrome dev tools in Mac
  if (e.metaKey && e.altKey && e.keyCode === 73) {
   e.preventDefault()
  }

  // Chrome dev tools in Windows/Linux
  if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
   e.preventDefault()
  }
 }

 // Disable right-click context menu
 function preventRightClick(e: MouseEvent) {
  e.preventDefault()
 }

 // Clear console and add warning
 function clearConsole() {
  console.clear()
  console.log('%cConsole is disabled', 'color: red; font-size: 24px; font-weight: bold;')
 }

 // Detect DevTools
 function detectDevTools() {
  const widthThreshold = window.outerWidth - window.innerWidth > 160
  const heightThreshold = window.outerHeight - window.innerHeight > 160

  if (widthThreshold || heightThreshold) {
   document.body.innerHTML = 'DevTools has been detected!'
  }
 }

 // Detect and prevent debugger statements
 function preventDebugger() {
  setInterval(() => {
   debugger
  }, 100)
 }

 // Detect debugging through Function.prototype.toString
 function detectFunctionBreakpoints() {
  const oldToString = Function.prototype.toString
  Function.prototype.toString = function () {
   const stack = new Error().stack || ''
   if (stack.includes('debug')) {
    document.body.innerHTML = 'Debugging is not allowed!'
   }
   return oldToString.apply(this, arguments)
  }
 }

 // Add event listeners
 window.addEventListener('keydown', preventDevToolsForChrome)
 window.addEventListener('contextmenu', preventRightClick)
 window.addEventListener('resize', detectDevTools)

 // Initial console clear
 clearConsole()

 // Periodically clear console
 setInterval(clearConsole, 2000)

 // Disable various debugging features
 setInterval(() => {
  Function.prototype.constructor = function () {
   return { muted: true }
  }
 }, 50)

 // Initialize debugger prevention
 preventDebugger()
 detectFunctionBreakpoints()

 return () => {
  // Cleanup function
  window.removeEventListener('keydown', preventDevToolsForChrome)
  window.removeEventListener('contextmenu', preventRightClick)
  window.removeEventListener('resize', detectDevTools)
 }
}
