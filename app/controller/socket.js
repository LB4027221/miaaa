module.exports = (app) => {
  class Controller extends app.Controller {
    async index() {
      const message = this.ctx.args[0]
      console.log('chat :', message + ' : ' + process.pid)
      this.ctx.socket.emit('res', 'hello')
    }
  }
  return Controller
}
