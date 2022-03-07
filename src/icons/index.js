

const requireAll = requireContext => requireContext.keys().map(requireContext)

const req = require.context('./svg', false, /\.svg$/)
// （创建了）一个包含了 svg 文件夹（不包含子目录）下面的、所有文件名以 `.suv` 结尾的、能被 require 请求到的文件的上下文。
// 这个是webpack提供的require方法，可以创建上下文环境。相当于将svg目录下的svg文件require进来。
requireAll(req)
