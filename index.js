class Pipeline {
  /**
   * an ascii pipeline generator
   * @class Pipeline
   * @param  {Array}  steps - an array of nested objects that represent pipeline states
   * @example
     new Pipeline([{
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
   */
  constructor (steps = []) {
    this.steps = steps
  }
  /**
   * returns the width and height of the matrix needed to generate the ascii-pipeline
   * @method getSize
   * @param  {Array}  steps - an array of nested objects that represent pipeline states
   * @return {Object} - an object with the properties { width: Number, height: Number }
   */
  getSize (steps) {
    let main = !steps
    // will allow us to get the size recursively
    if (!steps) {
      steps = this.steps
    }
    if (!steps.length) return { width: 0, height: 0 }

    let width = 0
    let height = 0
    steps.forEach((s) => {
      if (s.children) {
        let childSize = this.getSize(s.children)
        // ensure the height is the largest height possible
        if (height < childSize.width + 1) height = childSize.width + 1
        // we are not shortcutting this with a return because we want to also account for the width of this task
      }
      // we are only going horiztonal if we are at the top level
      width += 1
    })

    // If this is the main process and not a child process
    // We want to ensure we have enough space for the ascii pipes
    // This is the width - 1
    if (main) {
      width = width + width - 1
      height = height === 0 ? 1 : height
    }

    return {
      width,
      height
    }
  }
  static highlight (name, state) {
    // makes sure that we don't output ascii colors in the browser
    if (typeof window !== 'undefined') return name

    switch (state && state.toLowerCase()) {
      case 'success':
        return `\x1b[32m${name}\x1b[39m`
      case 'fail':
        return `\x1b[31m${name}\x1b[39m`
      case 'in_progress':
        return `\x1b[33m${name}\x1b[39m`
      case 'unknown':
      default:
        return `\x1b[25m${name}\x1b[39m`
    }
  }
  /**
   * generates the ascii matrix for the pipeline
   * @method generate
   * @return {Array<Array>} - a matrix describing the ascii-pipeline
   */
  generate () {
    const { steps } = this
    const { width, height } = this.getSize()
    // we want to multiply the width by two to ensure padding on both sides
    let matrix = Array(height).fill(null).map(() => Array(width * 2).fill(''))
    let offset = 0

    steps.forEach((step, i) => {
      // the offset is the index + index and for the name we make sure it always one plus that
      let signLeft = i === 0 ? 1 : i * 3 + offset
      let name = i === 0 ? 2 : i * 3 + 1 + offset
      let signRight = i === 0 ? 3 : i * 3 + 2 + offset

      // if we are in a nested scenario, we need to handle the children and sybols differently
      if (step.children) {
        // This is trying to find the max width of the column
        let maxWidth = step.name.length

        // This is only necessary if the children are longer than the parent
        step.children.forEach((cStep) => {
          if (maxWidth < cStep.name.length) maxWidth = cStep.name.length
        })

        // in order to make sure the pipeline stays the same length
        // we need to go to all arrays below and set the empty space
        matrix.forEach((m, mI) => {
          if (mI === 0) return
          if (!matrix[mI][name]) matrix[mI][name] = new Array(maxWidth + 1).fill(' ').join('')
        })

        // the nested chilren can be walked just as the parents
        step.children.forEach((cStep, cI) => {
          let row = cI + 1
          // if we are not the last child we want to keep the pipe open
          let leftCharacter = cI === step.children.length - 1 ? '└' : '├'
          let rightCharacter = cI === step.children.length - 1 ? '┘' : '┤'

          matrix[row][signLeft] = leftCharacter
          matrix[row][name] = Pipeline.highlight(cStep.name, cStep.status) + ' '.repeat(maxWidth - cStep.name.length)
          matrix[row][signRight] = rightCharacter

          // if we are adding an extra pipe, make sure we compensate with this for all child rows
          for (let _row = row; _row < height; _row++) {
            if (matrix[_row][signLeft]) continue
            matrix[_row][signLeft] = ' '
          }
        })

        matrix[0][signLeft] = '┬'
        matrix[0][name] = Pipeline.highlight(step.name, step.status) + ' '.repeat(maxWidth - step.name.length)
        matrix[0][signRight] = '┬'
        offset += 1
      } else {
        matrix[0][signLeft] = '─'
        matrix[0][signRight] = '─'
        // highlighting the name to make sure it is colorized by the state
        matrix[0][name] = Pipeline.highlight(step.name, step.status)
      }

      // in order to make sure the pipeline stays the same length
      // we need to go to all arrays below and set the empty space
      for (let row = 0; row < height; row++) {
        if (row === 0 || matrix[row][name].length > 0) continue
        matrix[row][name] = new Array(step.name.length + 1 + offset).fill(' ').join('')
      }

      if (step.children && steps[i + 1] && steps[i + 1].children) {
        matrix[0][signRight + 1] = '─'
        offset += 1

        // if we are adding an extra pipe, make sure we compensate with this for all child rows
        for (let row = 0; row < height; row++) {
          if (row === 0) continue
          matrix[row][signRight + 1] = ' '
        }
      }

      // As the last step ensure that the last character is -
      if (i === steps.length - 1) {
        if (i === 0 && steps[0].children) {
          matrix[0][signRight] = '┬'
        } else if (steps[i + 1] && steps[i + 1].children) {
          matrix[0][signRight] = '┬'
        } else {
          // only add an extra `─` if `┬` is the previous character
          if (matrix[0][signRight] !== '─') {
            matrix[0][signRight + 1] = '─'
          }
        }
      }
    })

    return matrix
  }
  toString () {
    return this.generate().join('\n').replace(/,/g, ' ')
  }
}

module.exports = Pipeline
