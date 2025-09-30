# Confluence MCP Server

一个基于MCP（模型上下文协议）服务器，为Confluence页面管理提供工具支持，使AI助手能够以编程方式与Confluence内容交互。

> **English** | [英文版 README](./README.md)

## 功能特性

- **空间管理**：获取所有Confluence空间及其页面
- **页面操作**：读取、创建和更新Confluence页面
- **内容搜索**：在Confluence空间中搜索内容

## 🚀 安装与配置

### 📋 系统要求

- **Node.js**: 16.0 或更高版本
- **Confluence访问权限**: 需要有效的Confluence账户访问权限

### 📦 安装步骤

```bash
# 克隆项目
git clone https://github.com/sansong089/confluence-mcp-server.git
cd confluence-mcp-server

# 安装依赖
npm install

# 构建项目
npm run build
```

### ⚙️ 配置

#### Claude Desktop

在 `claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "confluence-mcp-server": {
      "command": "node",
      "args": ["C:\\path\\to\\your\\confluence-mcp-server\\build\\confluence-server\\index.js"],
      "env": {
        "CONFLUENCE_URL": "https://your-confluence-instance.atlassian.net",
        "CONFLUENCE_USERNAME": "your-email@example.com",
        "CONFLUENCE_PASSWORD": "your-password"
      }
    }
  }
}
```

#### Cline

在 Cline MCP 设置中添加：

```json
{
  "mcpServers": {
    "confluence-mcp-server": {
      "command": "node",
      "args": ["/path/to/your/confluence-mcp-server/build/confluence-server/index.js"],
      "env": {
        "CONFLUENCE_URL": "https://your-confluence-instance.atlassian.net",
        "CONFLUENCE_USERNAME": "your-email@example.com",
        "CONFLUENCE_PASSWORD": "your-password"
      }
    }
  }
}
```

**注意**：请将路径替换为构建项目后 `build/confluence-server/index.js` 文件的实际路径。

### ✅ 验证

设置完成后，让AI助手列出可用工具。您应该看到以Confluence相关的工具，如`get_spaces`、`create_page`等。


### 可用工具

#### 空间查询工具

- **get_spaces**：获取所有Confluence空间
  - 参数：无

- **get_pages**：获取指定空间中的页面列表
  - 参数：
    - `spaceKey` (字符串，必填)：要获取页面的空间键名
    - `limit` (数字，可选)：返回的最大页面数量（默认：25）

#### 页面操作工具

- **read_page**：读取Confluence页面的完整内容
  - 参数：
    - `pageId` (字符串，必填)：要读取的页面ID

- **create_page**：在Confluence空间中创建新页面
  - 参数：
    - `spaceKey` (字符串，必填)：要在其中创建页面的空间键名
    - `title` (字符串，必填)：新页面的标题
    - `content` (字符串，必填)：页面的HTML格式内容
    - `parentId` (字符串，可选)：父页面的ID

- **update_page**：更新现有Confluence页面的内容
  - 参数：
    - `pageId` (字符串，必填)：要更新的页面ID
    - `title` (字符串，可选)：新页面标题
    - `content` (字符串，可选)：新的HTML格式内容

#### 搜索工具

- **search_content**：在Confluence中搜索内容
  - 参数：
    - `query` (字符串，必填)：搜索查询关键词
    - `spaceKey` (字符串，可选)：限制搜索到特定空间
    - `limit` (数字，可选)：返回的最大结果数量（默认：10）

## 开发说明

### 项目结构

```
src/
└── confluence-server/       # MCP协议处理
  └── index.ts               # 主服务器实现
```

### 构建

```bash
npm run build
```

这将把TypeScript文件编译为JavaScript文件，存储在`build/`目录中。

### 代码规范

项目使用TypeScript，遵循以下约定：

- 对异步操作使用`async/await`
- try/catch块进行适当的错误处理
- 为所有数据结构使用TypeScript接口
- 使用JSDoc注释进行文档化

## API速率限制

请注意Confluence API的速率限制。服务器包含超时设置，但您应该监控使用情况以避免达到速率限制。

## 错误处理

服务器为常见问题提供用户友好的错误消息：

- 身份验证失败
- 无效参数
- 网络超时
- API错误

## 贡献指南

1. Fork本仓库
2. 创建功能分支
3. 进行修改
4. 如适用，添加测试
5. 提交拉取请求

## ⚠️ 重要免责声明

**特别警告：修改删除操作绝对不得授权给AI助手自动执行**

**请仔细阅读以下条款：**

1. **使用限制**
   - 本软件仅供学习、开发和测试使用
   - 请勿在未经授权的生产环境中使用

2. **风险提示**
   - 使用者需自行承担所有操作后果
   - 包括但不限于数据丢失、服务中断等风险

3. **安全警告**
   - **修改删除操作绝对不得授权给AI助手自动执行**
   - 所有破坏性操作必须经过人工确认和审核
   - 具有Confluence管理权限的操作可能导致严重的安全风险
   - 请在安全可控的环境中运行

4. **免责条款**
   - 本项目按"原样"提供，不提供任何明示或暗示的保证
   - 作者不对使用本软件造成的任何损害承担责任

**使用前请确保您已理解并接受以上条款。**

--------
