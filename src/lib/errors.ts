class ErrorAPIToken extends Error {
 constructor(message?: string) {
  super(message ? message : 'API Authentication Failed')
  this.name = 'ErrorAPIToken'
 }
}

class NotFound extends Error {
 constructor(message?: string) {
  super(message ? message : 'Element Not Found')
  this.name = 'NotFound'
 }
}

export { ErrorAPIToken, NotFound }
