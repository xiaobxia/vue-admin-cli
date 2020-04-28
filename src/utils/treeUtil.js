function getChildrenKeys(children, key, keys) {
  keys = keys || []
  for (let i = 0; i < children.length; i++) {
    const item = children[i]
    keys.push(item[key])
    if (item.children && item.children.length > 0) {
      getChildrenKeys(item.children, key, keys)
    }
  }
  return keys
}

// 判断是否有一项在里面
function ifChildrenIn(children, keys) {
  for (let i = 0; i < children.length; i++) {
    const item = children[i]
    if (keys.indexOf(item.phid) !== -1) {
      return true
    } else {
      if (item.childList && item.childList.length > 0) {
        if (ifChildrenIn(item.childList, keys)) {
          return true
        }
      }
    }
  }
  return false
}

// 判断是否都在里面
function ifChildrenAllIn(children, keys) {
  for (let i = 0; i < children.length; i++) {
    const item = children[i]
    if (keys.indexOf(item.phid) === -1) {
      return false
    } else {
      if (item.childList && item.childList.length > 0) {
        if (!ifChildrenAllIn(item.childList, keys)) {
          return false
        }
      }
    }
  }
  return true
}

export default {
  getChildrenKeys,
  ifChildrenIn,
  ifChildrenAllIn
}
