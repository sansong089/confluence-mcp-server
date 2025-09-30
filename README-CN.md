# Confluence MCP Server

一个基于MCP（模型上下文协议）服务器，为Confluence页面管理提供工具支持，使AI助手能够以编程方式与Confluence内容交互。

> **English** | [英文版 README](./README.md)

## 功能特性

- **空间管理**：获取所有Confluence空间及其页面
- **页面操作**：读取、创建和更新Confluence页面
- **内容搜索**：在Confluence空间中搜索内容

## 安装说明

### 环境要求

- Node.js 16 或更高版本
- 访问Confluence实例的权限

### 安装依赖

```bash
npm install
```

### 构建项目

```bash
npm run build
```

## 配置说明

设置所需的环境变量：

```bash
export CONFLUENCE_URL="https://your-confluence-instance.atlassian.net"
export CONFLUENCE_USERNAME="your-username"
export CONFLUENCE_PASSWORD="your-api-token"
```

> **注意**：使用您的Atlassian账户邮箱作为用户名，API令牌作为密码。您可以在Atlassian账户设置中创建API令牌。

## 使用方法

### 启动服务器

```bash
npm start
```

服务器将启动并监听stdio中的MCP协议消息。

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
└── mcp-server/              # MCP协议处理
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

## 许可证

本项目采用MIT许可证。

## 贡献指南

1. Fork本仓库
2. 创建功能分支
3. 进行修改
4. 如适用，添加测试
5. 提交拉取请求

## 支持说明

如果您遇到问题或需要帮助：

1. 检查环境变量是否正确设置
2. 验证Confluence实例URL和凭据
3. 确保您在Confluence中具有必要的权限
4. 检查服务器日志以获取详细错误信息
