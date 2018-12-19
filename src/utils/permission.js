function checkIn(userRoles, roleList) {
  for (let i = 0; i < userRoles.length; i++) {
    const userRole = userRoles[i]
    for (let j = 0; j < userRoles.length; j++) {
      const roleItem = roleList[j]
      if (roleItem === userRole) {
        return true
      }
    }
  }
}
function checkPermission(userRoles, current) {
  // roles :{include, exclude}
  const roleMap = current.meta && current.meta.roles
  if (roleMap) {
    let permission = true
    const include = roleMap.include
    const exclude = roleMap.exclude
    // 存在于include
    if (include) {
      permission = checkIn(userRoles, include)
    }
    // 存在于exclude
    if (exclude && checkIn(userRoles, exclude)) {
      permission = false
    }
    // exclude有决定权
    return permission
  } else {
    // 没有权限要求
    return true
  }
}

export default {
  checkPermission
}
