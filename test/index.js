const test = require('tape')

const Pipeline = require('../index')

test('ascii-pipeline', (t) => {
  t.test('@highlight', t => {
    t.test('success', (t) => {
      t.plan(2)

      t.equal(Pipeline.highlight('hello', 'success'), '\x1b[32mhello\x1b[39m')
      t.equal(Pipeline.highlight('hello', 'SUCCESS'), '\x1b[32mhello\x1b[39m')
    })

    t.test('unknown', (t) => {
      t.plan(2)

      t.equal(Pipeline.highlight('hello', 'unknown'), '\x1b[33mhello\x1b[39m')
      t.equal(Pipeline.highlight('hello', 'UNKNOWN'), '\x1b[33mhello\x1b[39m')
    })

    t.test('uknown not passed', (t) => {
      t.plan(2)

      t.equal(Pipeline.highlight('hello'), '\x1b[33mhello\x1b[39m')
      t.equal(Pipeline.highlight('hello'), '\x1b[33mhello\x1b[39m')
    })

    t.test('uknown passed wrong state', (t) => {
      t.plan(2)

      t.equal(Pipeline.highlight('hello', 'woot'), '\x1b[33mhello\x1b[39m')
      t.equal(Pipeline.highlight('hello', 'woot'), '\x1b[33mhello\x1b[39m')
    })

    t.test('fail', (t) => {
      t.plan(2)

      t.equal(Pipeline.highlight('hello', 'fail'), '\x1b[31mhello\x1b[39m')
      t.equal(Pipeline.highlight('hello', 'FAIL'), '\x1b[31mhello\x1b[39m')
    })
  })

  t.test('@getSize', (t) => {
    t.test('should return positive', (t) => {
      t.plan(1)

      const pipe = new Pipeline([{
        name: 'starting',
        status: 'UNKNOWN'
      }, {
        name: 'nested',
        status: 'UNKNOWN',
        children: [{
          name: 'child',
          status: 'UNKNOWN'
        }, {
          name: 'child1',
          status: 'UNKNOWN'
        }]
      }, {
        name: 'ending',
        status: 'UNKNOWN'
      }])

      t.deepEqual(pipe.getSize(), {
        width: 5,
        height: 3
      })
    })

    t.test('should work with zero size', (t) => {
      t.plan(1)

      const pipe = new Pipeline([])

      t.deepEqual(pipe.getSize(), {
        width: 0,
        height: 0
      })
    })
  })

  t.test('@generate', (t) => {
    t.test('should work on nested values', (t) => {
      t.plan(1)

      const pipe = new Pipeline([{
        name: 'starting',
        status: 'UNKNOWN'
      }, {
        name: 'nested',
        status: 'UNKNOWN',
        children: [{
          name: 'child',
          status: 'UNKNOWN'
        }, {
          name: 'child1',
          status: 'UNKNOWN'
        }]
      }, {
        name: 'ending',
        status: 'UNKNOWN'
      }])

      t.deepEqual(pipe.generate(), [
        ['', '─', '\x1b[33mstarting\x1b[39m', '┬', '\x1b[33mnested\x1b[39m', '┬', '─', '\x1b[33mending\x1b[39m', '─', ''],
        ['', '', '         ', '├', '\x1b[33mchild\x1b[39m ', '┤', '', '       ', '', ''],
        ['', '', '         ', '└', '\x1b[33mchild1\x1b[39m', '┘', '', '       ', '', '']
      ])
    })

    t.test('should work on nested values (as the only value)', (t) => {
      t.plan(1)

      const pipe = new Pipeline([{
        name: 'nested',
        status: 'UNKNOWN',
        children: [{
          name: 'child',
          status: 'UNKNOWN'
        }, {
          name: 'child1',
          status: 'UNKNOWN'
        }]
      }])

      t.deepEqual(pipe.generate(), [
        ['', '┬', '\x1b[33mnested\x1b[39m', '┬'],
        ['', '├', '\x1b[33mchild\x1b[39m ', '┤'],
        ['', '└', '\x1b[33mchild1\x1b[39m', '┘']
      ])
    })

    t.test('should work on nested values (as the only value) ensure child reflowed parents width', (t) => {
      t.plan(1)

      const pipe = new Pipeline([{
        name: 'nested',
        status: 'UNKNOWN',
        children: [{
          name: 'long name child',
          status: 'UNKNOWN'
        }, {
          name: 'child1',
          status: 'UNKNOWN'
        }]
      }])

      t.deepEqual(pipe.generate(), [
        ['', '┬', '\x1b[33mnested\x1b[39m         ', '┬'],
        ['', '├', '\x1b[33mlong name child\x1b[39m', '┤'],
        ['', '└', '\x1b[33mchild1\x1b[39m         ', '┘']
      ])
    })

    t.test('should work non-nested values', (t) => {
      t.plan(1)

      const pipe = new Pipeline([{
        name: 'starting',
        status: 'UNKNOWN'
      }, {
        name: 'ending',
        status: 'UNKNOWN'
      }])

      t.deepEqual(pipe.generate(), [
        ['', '─', '\x1b[33mstarting\x1b[39m', '─', '\x1b[33mending\x1b[39m', '─']
      ])
    })

    t.test('should work a single task', (t) => {
      t.plan(1)

      const pipe = new Pipeline([{
        name: 'starting',
        status: 'UNKNOWN'
      }])

      t.deepEqual(pipe.generate(), [
        ['', '─', '\x1b[33mstarting\x1b[39m', '─']
      ])
    })

    t.test('should work on values that are nested with children longer than parent', (t) => {
      t.plan(1)

      const pipe = new Pipeline([{
        'name': 'foo',
        'status': 'unknown',
        'children': [{
          'name': 'echo $FOO',
          'status': 'unknown'
        }]
      },
      {
        'name': 'install',
        'status': 'unknown',
        'children': [{
          'name': 'npm --version',
          'status': 'unknown'
        },
        {
          'name': 'node --version',
          'status': 'unknown'
        },
        {
          'name': 'npm',
          'status': 'unknown'
        }
        ]
      },
      {
        'name': 'lint',
        'status': 'unknown',
        'children': [{
          'name': 'npm run lint',
          'status': 'unknown'
        }]
      },
      {
        'name': 'coverage',
        'status': 'unknown',
        'children': [{
          'name': 'npm run coverage',
          'status': 'unknown'
        }]
      },
      {
        'name': 'test',
        'status': 'unknown',
        'children': [{
          'name': 'npm test',
          'status': 'unknown'
        }]
      },
      {
        'name': 'docs',
        'status': 'unknown',
        'children': [{
          'name': 'npm run generate-docs',
          'status': 'unknown'
        }]
      }
      ])
      t.deepEqual(pipe.generate(), [
        ['', '┬', '\x1b[33mfoo\x1b[39m      ', '┬', '\x1b[33minstall\x1b[39m       ', '┬', '┬', '\x1b[33mlint\x1b[39m        ', '┬', '┬', '\x1b[33mcoverage\x1b[39m        ', '┬', '┬', '\x1b[33mtest\x1b[39m    ', '┬', '┬', '\x1b[33mdocs\x1b[39m                 ', '─', '', '', '', ''],
        ['', '└', '\x1b[33mecho $FOO\x1b[39m', '├', '\x1b[33mnpm --version\x1b[39m ', '┤', '└', '\x1b[33mnpm run lint\x1b[39m', '┘', '└', '\x1b[33mnpm run coverage\x1b[39m', '┘', '└', '\x1b[33mnpm test\x1b[39m', '┘', '└', '\x1b[33mnpm run generate-docs\x1b[39m', '┘', '', '', '', ''],
        ['', '', '          ', '├', '\x1b[33mnode --version\x1b[39m', '┤', '', '             ', '', '', '                 ', '', '', '         ', '', '', '                      ', '', '', '', '', ''],
        ['', '', '          ', '└', '\x1b[33mnpm\x1b[39m           ', '┘', '', '             ', '', '', '                 ', '', '', '         ', '', '', '                      ', '', '', '', '', '']
      ])
    })
  })

  t.test('@toString', (t) => {
    t.test('should work with nested values', (t) => {
      t.plan(1)

      const pipe = new Pipeline([{
        name: 'starting',
        status: 'UNKNOWN'
      }, {
        name: 'nested',
        status: 'UNKNOWN',
        children: [{
          name: 'child',
          status: 'UNKNOWN'
        }, {
          name: 'child1',
          status: 'UNKNOWN'
        }]
      }, {
        name: 'ending',
        status: 'UNKNOWN'
      }])

      t.deepEqual(pipe.toString(), ' ─ \x1b[33mstarting\x1b[39m ┬ \x1b[33mnested\x1b[39m ┬ ─ \x1b[33mending\x1b[39m ─ \n            ├ \x1b[33mchild\x1b[39m  ┤           \n            └ \x1b[33mchild1\x1b[39m ┘           ')
    })
  })
})
