# ascii-pipeline

> 📟 ascii pipelines made easy

[![Npm Version](https://img.shields.io/npm/v/ascii-pipeline.svg)](https://www.npmjs.com/package/ascii-pipeline)
[![Build Status](https://travis-ci.org/gabrielcsapo/ascii-pipeline.svg?branch=master)](https://travis-ci.org/gabrielcsapo/ascii-pipeline)
[![Dependency Status](https://starbuck.gabrielcsapo.com/badge/github/gabrielcsapo/ascii-pipeline/status.svg)](https://starbuck.gabrielcsapo.com/github/gabrielcsapo/ascii-pipeline)
[![devDependency Status](https://starbuck.gabrielcsapo.com/badge/github/gabrielcsapo/ascii-pipeline/dev-status.svg)](https://starbuck.gabrielcsapo.com/github/gabrielcsapo/ascii-pipeline#info=devDependencies)
[![Coverage Status](https://lcov-server.gabrielcsapo.com/badge/github%2Ecom/gabrielcsapo/ascii-pipeline.svg)](https://lcov-server.gabrielcsapo.com/coverage/github%2Ecom/gabrielcsapo/ascii-pipeline)
[![npm](https://img.shields.io/npm/dt/ascii-pipeline.svg?maxAge=2592000)]()
[![npm](https://img.shields.io/npm/dm/ascii-pipeline.svg?maxAge=2592000)]()

## Installation

```
npm install ascii-pipeline --save
```

## Usage

```js
const Pipeline = require('ascii-pipeline');

const pipe = new Pipeline([{
  name: 'starting',
  status: 'SUCCESS',
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
  name: 'ending',
  status: 'SUCCESS'
}]);

console.log(pipe.toString());
```

This will output:

```bash
─ starting ┬ nested ┬ ending ─
           ├ child  ┤         
           └ child1 ┘
```

Or the colorized version:

<p align="center">
  <img height="350px" src="./docs/output.png"/>
</p>
