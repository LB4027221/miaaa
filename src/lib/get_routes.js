/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&%@.\w_]*)#?(?:[\w]*))?)$/g

export function isUrl(path) {
  return reg.test(path)
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/')
  const arr2 = str2.split('/')
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2
  }
  return 3
}

function getRenderArr(routes) {
  let renderArr = []
  renderArr.push(routes[0])
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3)
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1)
    if (isAdd) {
      renderArr.push(routes[i])
    }
  }
  return renderArr
}


const getRoutes = (path, routerData) => {
  let routes = Object.keys(routerData).filter(routePath =>
    routePath.indexOf(path) === 0 && routePath !== path)

  routes = routes.map(item => item.replace(path, ''))

  const renderArr = getRenderArr(routes)
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1)
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`
    }
  })
  return renderRoutes
}

export default getRoutes
