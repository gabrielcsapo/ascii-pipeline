const { name, description } = require('./package.json');

module.exports = {
  title: name,
  description: description,
  nav: {
    Source: "https://github.com/gabrielcsapo/ascii-pipeline"
  },
  body: [{
    type: "text",
    value: `
      > [\`ascii-pipeline\`](https://github.com/gabrielcsapo/ascii-pipeline) 📟 ascii pipelines made easy.
      <br/>
      \`\`\`
      npm install ascii-pipeline --save
      \`\`\`
    `
  }, {
    type: "code",
    title: "Generating an ascii pipeline with nested",
    value: `
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

        pipe.toString();
      `
  }],
  output: "./docs",
  externals: [
    "./dist/ascii-pipeline.min.js",
    "./docs/main.css"
  ]
};
