const Pipeline = require('./index')

const pipe = new Pipeline([{
  name: 'starting',
  status: 'SUCCESS'
}, {
  name: 'nested',
  status: 'SUCCESS',
  children: [{
    name: 'child',
    status: 'FAIL'
  }, {
    name: 'child1',
    status: 'SUCCESS'
  }]
}, {
  name: 'almost',
  status: 'IN_PROGRESS'
}, {
  name: 'ending',
  status: 'UNKNOWN'
}])

console.log(pipe.toString())
