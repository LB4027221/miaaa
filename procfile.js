'use strict'

module.exports = (pandora) => {
  process.env.NODE_ENV = 'production'
  pandora
    .fork('miaaa', './start.js')

  /**
   * you can also use cluster mode to start application
   */
  // pandora
  //   .cluster('./start.js');

  /**
   * you can create another process here
   */
  // pandora
  //   .process('background')
  //   .nodeArgs(['--expose-gc']);

  /**
   * more features please visit our document.
   * https://github.com/midwayjs/pandora/
   */
}
