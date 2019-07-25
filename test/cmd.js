var assert = require('assert')


describe('serverline(1)', function() {
  describe('default usage', function() {
    const myRL = require('./../bin/index.js')

    it('can init serverline', function() {
      myRL.init()

      assert.ok(true)
    })

    it('can log something', function() {
      console.log('A')
      console.log('B')
      console.log('C')
      console.log('D')

      assert.ok(true)
    })

    it('can exit', function(done) {
      myRL.setPrompt('')
      myRL.pause()
      done(0)
    })
  })
})

