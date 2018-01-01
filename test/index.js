const test = require('tape');

const Pipeline = require('../index');

test('ascii-pipeline', (t) => {

  t.test('@highlight (success)', (t) => {
    t.equal(Pipeline.highlight('hello', 'success'), '\x1b[32mhello\x1b[39m');
    t.equal(Pipeline.highlight('hello', 'SUCCESS'), '\x1b[32mhello\x1b[39m');
    t.end();
  });

  t.test('@highlight (unknown)', (t) => {
    t.equal(Pipeline.highlight('hello', 'unknown'), '\x1b[33mhello\x1b[39m');
    t.equal(Pipeline.highlight('hello', 'UNKNOWN'), '\x1b[33mhello\x1b[39m');
    t.end();
  });

  t.test('@highlight (uknown not passed)', (t) => {
    t.equal(Pipeline.highlight('hello'), '\x1b[33mhello\x1b[39m');
    t.equal(Pipeline.highlight('hello'), '\x1b[33mhello\x1b[39m');
    t.end();
  });

  t.test('@highlight (uknown passed wrong state)', (t) => {
    t.equal(Pipeline.highlight('hello', 'woot'), '\x1b[33mhello\x1b[39m');
    t.equal(Pipeline.highlight('hello', 'woot'), '\x1b[33mhello\x1b[39m');
    t.end();
  });

  t.test('@highlight (fail)', (t) => {
    t.equal(Pipeline.highlight('hello', 'fail'), '\x1b[31mhello\x1b[39m');
    t.equal(Pipeline.highlight('hello', 'FAIL'), '\x1b[31mhello\x1b[39m');
    t.end();
  });

  t.test('@getSize', (t) => {
    t.test('should return positive', (t) => {
      const pipe = new Pipeline([{
        name: 'starting',
        status: 'UNKNOWN'
      }, {
        name: 'nested',
        status: 'UNKNOWN',
        children: [{
          name: 'child',
          status: 'UNKNOWN',
        }, {
          name: 'child1',
          status: 'UNKNOWN',
        }]
      }, {
        name: 'ending',
        status: 'UNKNOWN'
      }]);

      t.deepEqual(pipe.getSize(), {
        width: 5,
        height: 3
      });
      t.end();
    });

    t.test('should work with zero size', (t) => {
      const pipe = new Pipeline([]);

      t.deepEqual(pipe.getSize(), {
        width: 0,
        height: 0
      });
      t.end();
    })
  });

  t.test('@generate', (t) => {
    t.test('should work on nested values', (t) => {
      const pipe = new Pipeline([{
        name: 'starting',
        status: 'UNKNOWN'
      }, {
        name: 'nested',
        status: 'UNKNOWN',
        children: [{
          name: 'child',
          status: 'UNKNOWN',
        }, {
          name: 'child1',
          status: 'UNKNOWN',
        }]
      }, {
        name: 'ending',
        status: 'UNKNOWN'
      }]);

      t.deepEqual(pipe.generate(), [
        ['─',
          '\u001b[33mstarting\u001b[39m',
          '┬',
          '\u001b[33mnested\u001b[39m',
          '┬',
          '\u001b[33mending\u001b[39m',
          '─'
        ],
        ['',
          '         ',
          '├',
          '\u001b[33mchild\u001b[39m ',
          '┤',
          '       ',
          ''
        ],
        ['',
          '         ',
          '└',
          '\u001b[33mchild1\u001b[39m',
          '┘',
          '       ',
          ''
        ]
      ]);
      t.end();
    });

    t.test('should work on nested values (as the only value)', (t) => {
      const pipe = new Pipeline([{
        name: 'nested',
        status: 'UNKNOWN',
        children: [{
          name: 'child',
          status: 'UNKNOWN',
        }, {
          name: 'child1',
          status: 'UNKNOWN',
        }]
      }]);

      t.deepEqual(pipe.generate(), [
        ['┬', '\x1b[33mnested\x1b[39m', '┬'],
        ['├', '\x1b[33mchild\x1b[39m ', '┤'],
        ['└', '\x1b[33mchild1\x1b[39m', '┘']
      ]);
      t.end();
    });

    t.test('should work on nested values (as the only value) ensure child reflowed parents width', (t) => {
      const pipe = new Pipeline([{
        name: 'nested',
        status: 'UNKNOWN',
        children: [{
          name: 'long name child',
          status: 'UNKNOWN',
        }, {
          name: 'child1',
          status: 'UNKNOWN',
        }]
      }]);

      t.deepEqual(pipe.generate(), [
        ['┬', '\x1b[33mnested\x1b[39m         ', '┬'],
        ['├', '\x1b[33mlong name child\x1b[39m', '┤'],
        ['└', '\x1b[33mchild1\x1b[39m         ', '┘']
      ]);
      t.end();
    });

    t.test('should work non-nested values', (t) => {
      const pipe = new Pipeline([{
        name: 'starting',
        status: 'UNKNOWN'
      }, {
        name: 'ending',
        status: 'UNKNOWN'
      }]);

      t.deepEqual(pipe.generate(), [
        ['─', '\x1b[33mstarting\x1b[39m', '─', '\x1b[33mending\x1b[39m', '─']
      ]);
      t.end();
    });

    t.test('should work a single task', (t) => {
      const pipe = new Pipeline([{
        name: 'starting',
        status: 'UNKNOWN'
      }]);

      t.deepEqual(pipe.generate(), [
        ['─', '\x1b[33mstarting\x1b[39m', '─']
      ]);
      t.end();
    });
  });

  t.test('@toString', (t) => {
    t.test('should work with nested values', (t) => {
      const pipe = new Pipeline([{
        name: 'starting',
        status: 'UNKNOWN'
      }, {
        name: 'nested',
        status: 'UNKNOWN',
        children: [{
          name: 'child',
          status: 'UNKNOWN',
        }, {
          name: 'child1',
          status: 'UNKNOWN',
        }]
      }, {
        name: 'ending',
        status: 'UNKNOWN'
      }]);

      t.deepEqual(pipe.toString(), '─ \x1b[33mstarting\x1b[39m ┬ \x1b[33mnested\x1b[39m ┬ \x1b[33mending\x1b[39m ─\n           ├ \x1b[33mchild\x1b[39m  ┤         \n           └ \x1b[33mchild1\x1b[39m ┘         ');
      t.end();
    });
  });

});
