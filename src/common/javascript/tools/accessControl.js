/*eslint-disable */
import config from 'common/config/config'
import resource from 'common/config/resource'

// var resourceStr = localStorage.resource === undefined ? "" : localStorage.resource.substring(2, localStorage.resource.length - 2)
var resourceStr = localStorage.resource === undefined ? "" : localStorage.resource

/**
 * 资源字符串
 */
function initResourceStr () {
  resourceStr = localStorage.resource === undefined ? "" : localStorage.resource
}

/**
 * 获得权限树
 * @param{int}parentId 父Id
 */
function accessTree (parentCode) {
  var tree = []
  var data = accessControl.getAllAccess()
  for (var i = 0; i < data.length; i++) {
    var json = data[i]
    if (json.parentCode === parentCode) {
      var tmp = {code: json.code, label: json.name, url: json.url, children: []}
      tmp.children = this.accessTree(json.code, data)
      tree.push(tmp)
    }
  }
  return tree
}

/**
 * 获得父级id
 */
function getParentId (code) {
  var pidArr = []
  var data = accessControl.getAllAccess()
  for (var i = 0; i < data.length; i++) {
    var json = data[i]
    // 修改 ''
    if (json.code === code && json.parentCode !== 0) {
      pidArr.push(json.parentCode)
      var tmpId = accessControl.getParentId(json.parentCode)
      if (tmpId !== []) {
        pidArr = pidArr.concat(tmpId)
      }
    }
  }
  return pidArr
}

/**
 * 获得子id
 */
function getChildrenId (code) {
  var cidArr = []
  var data = accessControl.getAllAccess()
  for (var i = 0; i < data.length; i++) {
    var json = data[i]
    if (json.parentCode === code) {
      cidArr.push(json.code)
      var tmpId = accessControl.getChildrenId(json.code)
      if (tmpId !== []) {
        cidArr = cidArr.concat(tmpId)
      }
    }
  }
  return cidArr
}

/**
 * 获得资源数组
 */
function getAllAccess () {
  if (resourceStr === '') {
    return []
  }
  return JSON.parse(resourceStr)
}
  // var data = []
  // var arr = resourceStr.split('","')
  // for (var i = 0; i < arr.length; i++) {
  //   var str = arr[i].replace(/\"/g, "")
  //   str = str.replace(/\\/g, '"')
  //   data.push(JSON.parse(str))
  // }

  // var topMenu = []
  // var newData = []
  // var resourceSort = resource.menuSort
  // for (i = 0; i < data.length; i++) {
  //   if (data[i].type === 0) {
  //     topMenu.push(data[i])
  //   } else {
  //     newData.push(data[i])
  //   }
  // }
  // for (var j = 0; j < topMenu.length; j++) {
  //   for (i = resourceSort.length - 1; i >= 0; i--) {
  //     if (resourceSort[i].id === topMenu[j].id) {
  //       topMenu[j].sort = resourceSort[i].sort
  //     }
  //   }
  // }

//   var tmpId = null
//   var tmpName = null
//   var tmpType = null
//   var tmpParentId = null
//   var tmpUrl = null
//   var tmpIcon = null
//   var tmpSort = null
//   var tmpChildrenSelect = null
//   for (i = 0; i < topMenu.length; i++) {
//     for (j = i + 1; j < topMenu.length; j++) {
//       if (topMenu[i].id === topMenu[j].id) {
//         continue
//       }
//       if (topMenu[i].sort > topMenu[j].sort) {
//         tmpId = topMenu[j].id
//         tmpName = topMenu[j].name
//         tmpType = topMenu[j].type
//         tmpParentId = topMenu[j].parentId
//         tmpUrl = topMenu[j].url
//         tmpIcon = topMenu[j].icon
//         tmpSort = topMenu[j].sort
//         tmpChildrenSelect = topMenu[j].children_select
//
//         topMenu[j].id = topMenu[i].id
//         topMenu[j].name = topMenu[i].name
//         topMenu[j].type = topMenu[i].type
//         topMenu[j].parentId = topMenu[i].parentId
//         topMenu[j].url = topMenu[i].url
//         topMenu[j].icon = topMenu[i].icon
//         topMenu[j].sort = topMenu[i].sort
//         topMenu[j].children_select = topMenu[i].children_select
//
//         topMenu[i].id = tmpId
//         topMenu[i].name = tmpName
//         topMenu[i].type = tmpType
//         topMenu[i].parentId = tmpParentId
//         topMenu[i].url = tmpUrl
//         topMenu[i].icon = tmpIcon
//         topMenu[i].sort = tmpSort
//         topMenu[i].children_select = tmpChildrenSelect
//       }
//     }
//   }
//   return topMenu.concat(newData)
// }

/**
 * 检测是否拥有该资源（权限）
 * @param{String}resource 被检测资源
 */
function checkAccess (resource) {
  // 是否忽略权限校验
  if (!config.noAccessJump) {
    return true
  }
  var accessArr = accessControl.getAllAccess()
  for (var j = 0; j < accessArr.length; j++) {
    if (accessArr[j].url === resource) {
      return true
    }
  }
  return false
}

/**
 * 检测是否在权限白名单里
 * @param{String}resource 被检测资源（“#”后面，“?”前面的路由字符串，不包含“#”和“?”）
 */
function checkAccessWhiteList (access) {
  var whiteList = config.accessWhiteList
  for (var i = 0; i < whiteList.length; i++) {
    if (whiteList[i] === access) {
      return true
    }
  }
  return false
}

const accessControl = {
  initResourceStr: initResourceStr,
  getAllAccess: getAllAccess,
  checkAccess: checkAccess,
  checkAccessWhiteList: checkAccessWhiteList,
  accessTree: accessTree,
  getParentId: getParentId,
  getChildrenId: getChildrenId
}

export default accessControl
