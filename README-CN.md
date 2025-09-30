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

## 免责声明

### ⚠️ 重要安全警告

**本项目实现简单，仅包含基础安全控制且无高级权限限制，主要设计用于易于安装和测试目的。**

#### ⚠️ 关键限制
- **无权限验证**：工具直接执行操作而不检查用户在Confluence中的权限
- **无访问控制**：配置的任何用户都可以执行所有操作（创建、更新、删除）
- **简单身份验证**：仅使用基础HTTP身份验证

#### ⚠️ AI助手使用限制
**本工具提供的修改和删除操作绝对不可用于AI助手的自动批准。**所有写入操作（创建、更新、删除）都需要：

- **人工审核**：每个操作都应由人工操作员审核
- **明确批准**：执行任何破坏性操作前需要人工确认
- **数据备份**：执行任何操作前确保Confluence内容已备份

#### ⚠️ 数据安全风险
- **潜在数据丢失**：不当使用可能导致意外的内容删除或损坏
- **无回滚机制**：某些操作可能无法通过此工具轻松撤销
- **错误恢复有限**：基础错误处理可能无法覆盖所有边缘情况

#### ⚠️ 责任声明
用户对以下内容承担全部责任：
- 了解每个操作的潜在影响
- 确保所有更改都有适当的授权
- 维护关键内容的备份
- 遵守组织的数据管理政策

**使用本工具即表示您承认这些限制，并接受因使用此工具而产生的任何后果的全部责任。**

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
