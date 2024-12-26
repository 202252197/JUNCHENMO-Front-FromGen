const styles = {
  'el-rate': '.el-rate{display: inline-block; vertical-align: text-top;}',
  'el-upload': '.el-upload__tip{line-height: 1.2;}',
  'h1': '.head-title-h1 {color: #1A93F9;font-size: 18px;height: 25px;line-height: 25px;text-shadow: #5B96E9AB 2px 2px 3px;border-left: 5px solid #3f92d991;padding-left: 10px;}',
  'h2': '.head-title-h2 {color: #1A93F9;font-size: 15px;height: 24px;line-height: 24px;text-shadow: #5B96E9AB 2px 2px 3px;border-left: 5px solid rgba(81, 97, 237, 0.57);padding-left: 10px;}'
}


function addCss(cssList, el) {
  const css = styles[el.tag]
  css && cssList.indexOf(css) === -1 && cssList.push(css)
  if (el.children) {
    el.children.forEach(el2 => addCss(cssList, el2))
  }
}

export function makeUpCss(conf) {
  const cssList = []
  conf.fields.forEach(el => addCss(cssList, el))
  return cssList.join('\n')
}
