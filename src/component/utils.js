const localeMessage = (message) => {
    switch (message) {
        case 'Invalid parameters.':
            return '参数错误';
        case 'Fail to save the requested item to database.':
            return '数据库保存失败';
        case 'Fail to remove the requested item from database.':
            return '删除失败';
        case 'Fail to retrieve the requested item from database.':
            return '获取失败';
        case 'User not found.':
            return '用户不存在';
        case 'Wrong user name or password.':
            return '用户名或密码错误';
        case 'User already exists.':
            return '用户已存在';
        case 'Unsupported file format (file ext. error)':
            return '文件格式错误';
        case 'Please log in to your account.':
            return '请登录';
        case 'Login failed, please try again.':
            return '登录失败，请重试';
        case 'Token has expired, please log in again.':
            return '登录已过期，请重新登录';
        case 'Token is illegal, please log in again.':
            return '非法登录，请重新登录';
        case 'Logout failed, please try again.':
            return '登出失败，请重试';
        case 'Redis connection failed.':
            return 'Redis连接失败';
        case 'Too many failed login attempts, please try again after 5 minutes.':
            return '登录失败次数过多，请5分钟后重试';
        case 'Insufficient permissions, access denied.':
            return '权限不足，拒绝访问';
        default:
            return '服务器错误';
    }
}

export { localeMessage }