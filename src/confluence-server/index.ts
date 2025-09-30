#!/usr/bin/env node

/**
 * Confluence MCP Server - 为Confluence提供MCP工具支持
 * 支持页面查询、内容操作和搜索功能
 */

// 基础导入
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

// 环境变量配置检查
const CONFLUENCE_URL = process.env.CONFLUENCE_URL;
const CONFLUENCE_USERNAME = process.env.CONFLUENCE_USERNAME;
const CONFLUENCE_PASSWORD = process.env.CONFLUENCE_PASSWORD;

if (!CONFLUENCE_URL || !CONFLUENCE_USERNAME || !CONFLUENCE_PASSWORD) {
  throw new Error('需要设置环境变量：CONFLUENCE_URL, CONFLUENCE_USERNAME, CONFLUENCE_PASSWORD');
}

// 类型定义
/** Confluence空间接口 */
interface ConfluenceSpace {
  id: number;
  key: string;
  name: string;
  type: string;
}

/** Confluence页面接口 */
interface ConfluencePage {
  id: string;
  type: string;
  status: string;
  title: string;
  space: ConfluenceSpace;
  extensions?: any;
}

/** Confluence内容接口 */
interface ConfluenceContent {
  id: string;
  type: string;
  title: string;
  space: ConfluenceSpace;
  body?: {
    storage?: {
      value: string;
      representation: string;
    };
  };
  version?: {
    number: number;
  };
}

// 工具分类枚举
enum ToolCategory {
  SPACE_QUERY = 'space_query',     // 空间查询工具
  PAGE_OPERATION = 'page_operation', // 页面操作工具
  SEARCH = 'search'               // 搜索工具
}

// 工具名称常量
const TOOL_NAMES = {
  // 空间查询类工具
  GET_SPACES: 'get_spaces',
  GET_PAGES: 'get_pages',

  // 页面操作类工具
  READ_PAGE: 'read_page',
  CREATE_PAGE: 'create_page',
  UPDATE_PAGE: 'update_page',

  // 搜索类工具
  SEARCH_CONTENT: 'search_content'
} as const;

// 参数验证函数
/**
 * 验证获取空间参数（无参数）
 */
const isValidGetSpacesArgs = (args: any): args is {} => typeof args === 'object' && args !== null;

/**
 * 验证获取页面参数
 */
const isValidGetPagesArgs = (args: any): args is { spaceKey: string; limit?: number } =>
  typeof args === 'object' &&
  args !== null &&
  typeof args.spaceKey === 'string' &&
  (args.limit === undefined || typeof args.limit === 'number');

/**
 * 验证读取页面参数
 */
const isValidReadPageArgs = (args: any): args is { pageId: string } =>
  typeof args === 'object' &&
  args !== null &&
  typeof args.pageId === 'string';

/**
 * 验证创建页面参数
 */
const isValidCreatePageArgs = (args: any): args is { spaceKey: string; title: string; content: string; parentId?: string } =>
  typeof args === 'object' &&
  args !== null &&
  typeof args.spaceKey === 'string' &&
  typeof args.title === 'string' &&
  typeof args.content === 'string' &&
  (args.parentId === undefined || typeof args.parentId === 'string');

/**
 * 验证更新页面参数
 */
const isValidUpdatePageArgs = (args: any): args is { pageId: string; title?: string; content?: string } =>
  typeof args === 'object' &&
  args !== null &&
  typeof args.pageId === 'string' &&
  (args.title === undefined || typeof args.title === 'string') &&
  (args.content === undefined || typeof args.content === 'string');

/**
 * 验证搜索内容参数
 */
const isValidSearchArgs = (args: any): args is { query: string; spaceKey?: string; limit?: number } =>
  typeof args === 'object' &&
  args !== null &&
  typeof args.query === 'string' &&
  (args.spaceKey === undefined || typeof args.spaceKey === 'string') &&
  (args.limit === undefined || typeof args.limit === 'number');

/**
 * Confluence服务器类
 * 负责初始化MCP服务器，处理Confluence API请求
 */
class ConfluenceServer {
  private server: Server;
  private axiosInstance;

  /**
   * 构造函数，初始化服务器和HTTP客户端
   */
  constructor() {
    // 初始化MCP服务器
    this.server = new Server(
      {
        name: 'confluence-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // 初始化HTTP客户端
    this.axiosInstance = axios.create({
      baseURL: CONFLUENCE_URL,
      timeout: 10000,
    });

    // 配置基础认证
    const auth = Buffer.from(`${CONFLUENCE_USERNAME}:${CONFLUENCE_PASSWORD}`).toString('base64');
    this.axiosInstance.defaults.headers.common['Authorization'] = `Basic ${auth}`;

    // 设置工具处理器
    this.setupToolHandlers();

    // 设置错误处理器
    this.server.onerror = (error) => console.error('[MCP Error]', error);

    // 设置进程退出处理器
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * 设置工具处理器，按照功能分类组织
   */
  private setupToolHandlers() {
    // 空间查询工具
    const spaceQueryTools = [
      {
        name: TOOL_NAMES.GET_SPACES,
        description: '获取所有Confluence空间列表',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: TOOL_NAMES.GET_PAGES,
        description: '获取指定空间中的页面列表',
        inputSchema: {
          type: 'object',
          properties: {
            spaceKey: {
              type: 'string',
              description: '空间键名，用于指定要获取页面的空间',
            },
            limit: {
              type: 'number',
              description: '返回的最大页面数量（默认：25）',
            },
          },
          required: ['spaceKey'],
        },
      },
    ];

    // 页面操作工具
    const pageOperationTools = [
      {
        name: TOOL_NAMES.READ_PAGE,
        description: '读取Confluence页面的完整内容',
        inputSchema: {
          type: 'object',
          properties: {
            pageId: {
              type: 'string',
              description: '要读取的页面ID',
            },
          },
          required: ['pageId'],
        },
      },
      {
        name: TOOL_NAMES.CREATE_PAGE,
        description: '在Confluence空间中创建新页面',
        inputSchema: {
          type: 'object',
          properties: {
            spaceKey: {
              type: 'string',
              description: '要在其中创建页面的空间键名',
            },
            title: {
              type: 'string',
              description: '新页面的标题',
            },
            content: {
              type: 'string',
              description: '页面的HTML格式内容',
            },
            parentId: {
              type: 'string',
              description: '父页面的ID（可选）',
            },
          },
          required: ['spaceKey', 'title', 'content'],
        },
      },
      {
        name: TOOL_NAMES.UPDATE_PAGE,
        description: '更新现有Confluence页面的内容',
        inputSchema: {
          type: 'object',
          properties: {
            pageId: {
              type: 'string',
              description: '要更新的页面ID',
            },
            title: {
              type: 'string',
              description: '新页面标题（可选）',
            },
            content: {
              type: 'string',
              description: '新的HTML格式内容（可选）',
            },
          },
          required: ['pageId'],
        },
      },
    ];

    // 搜索工具
    const searchTools = [
      {
        name: TOOL_NAMES.SEARCH_CONTENT,
        description: '在Confluence中搜索指定内容',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: '搜索查询关键词',
            },
            spaceKey: {
              type: 'string',
              description: '限制搜索到特定空间（可选）',
            },
            limit: {
              type: 'number',
              description: '返回的最大结果数量（默认：10）',
            },
          },
          required: ['query'],
        },
      },
    ];

    // 设置工具列表处理器
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        // ==================== 空间查询工具 ====================
        ...spaceQueryTools,
        // ==================== 页面操作工具 ====================
        ...pageOperationTools,
        // ==================== 搜索工具 ====================
        ...searchTools,
      ],
    }));

    // 设置工具调用处理器，按照工具分类排序处理
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          // ==================== 空间查询工具 ====================
          case TOOL_NAMES.GET_SPACES:
            if (!isValidGetSpacesArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, '无效的get_spaces参数');
            }
            return await this.handleGetSpaces();

          case TOOL_NAMES.GET_PAGES:
            if (!isValidGetPagesArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, '无效的get_pages参数');
            }
            return await this.handleGetPages(request.params.arguments);

          // ==================== 页面操作工具 ====================
          case TOOL_NAMES.READ_PAGE:
            if (!isValidReadPageArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, '无效的read_page参数');
            }
            return await this.handleReadPage(request.params.arguments);

          case TOOL_NAMES.CREATE_PAGE:
            if (!isValidCreatePageArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, '无效的create_page参数');
            }
            return await this.handleCreatePage(request.params.arguments);

          case TOOL_NAMES.UPDATE_PAGE:
            if (!isValidUpdatePageArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, '无效的update_page参数');
            }
            return await this.handleUpdatePage(request.params.arguments);

          // ==================== 搜索工具 ====================
          case TOOL_NAMES.SEARCH_CONTENT:
            if (!isValidSearchArgs(request.params.arguments)) {
              throw new McpError(ErrorCode.InvalidParams, '无效的search_content参数');
            }
            return await this.handleSearchContent(request.params.arguments);

          default:
            throw new McpError(ErrorCode.MethodNotFound, `未知工具: ${request.params.name}`);
        }
      } catch (error) {
        // 处理API错误，返回友好的错误消息
        if (axios.isAxiosError(error)) {
          return {
            content: [
              {
                type: 'text',
                text: `Confluence API 错误: ${error.response?.status} ${error.response?.statusText || error.message}`,
              },
            ],
            isError: true,
          };
        }
        throw error;
      }
    });
  }

  // ==================== 空间查询处理方法 ====================

  /**
   * 获取所有Confluence空间列表
   * @returns 空间信息的JSON响应
   */
  private async handleGetSpaces() {
    const response = await this.axiosInstance.get('/rest/api/space');
    const spaces = response.data.results.map((space: any) => ({
      id: space.id,
      key: space.key,
      name: space.name,
      type: space.type,
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(spaces, null, 2),
        },
      ],
    };
  }

  /**
   * 获取指定空间中的页面列表
   * @param args 包含空间键名和限制数量的参数
   * @returns 页面信息的JSON响应
   */
  private async handleGetPages(args: { spaceKey: string; limit?: number }) {
    const response = await this.axiosInstance.get('/rest/api/content', {
      params: {
        spaceKey: args.spaceKey,
        type: 'page',
        limit: args.limit || 25,
      },
    });

    const pages = response.data.results.map((content: any) => ({
      id: content.id,
      title: content.title,
      status: content.status || 'current',
      type: content.type,
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(pages, null, 2),
        },
      ],
    };
  }

  // ==================== 页面操作处理方法 ====================

  /**
   * 读取指定页面的完整内容
   * @param args 包含页面ID的参数
   * @returns 页面详细信息的JSON响应
   */
  private async handleReadPage(args: { pageId: string }) {
    const response = await this.axiosInstance.get(`/rest/api/content/${args.pageId}`, {
      params: {
        expand: 'body.storage,version,space',
      },
    });

    const page = {
      id: response.data.id,
      title: response.data.title,
      type: response.data.type,
      space: response.data.space ? {
        id: response.data.space.id,
        key: response.data.space.key,
        name: response.data.space.name,
      } : undefined,
      body: response.data.body,
      version: response.data.version,
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(page, null, 2),
        },
      ],
    };
  }

  /**
   * 在指定空间中创建新页面
   * @param args 包含空间键名、标题、内容和可选父页面ID的参数
   * @returns 创建成功的响应，包含新页面ID
   */
  private async handleCreatePage(args: { spaceKey: string; title: string; content: string; parentId?: string }) {
    const ancestors = args.parentId ? [{ id: args.parentId }] : [];

    const payload = {
      type: 'page',
      title: args.title,
      space: { key: args.spaceKey },
      body: {
        storage: {
          value: args.content,
          representation: 'storage',
        },
      },
      ancestors, // 设置父页面关系
    };

    const response = await this.axiosInstance.post('/rest/api/content', payload);

    return {
      content: [
        {
          type: 'text',
          text: `页面创建成功。ID: ${response.data.id}`,
        },
      ],
    };
  }

  /**
   * 更新现有页面的内容和/或标题
   * @param args 包含页面ID、标题和内容的参数
   * @returns 更新成功的响应消息
   */
  private async handleUpdatePage(args: { pageId: string; title?: string; content?: string }) {
    // 获取当前版本号以避免冲突
    const currentResponse = await this.axiosInstance.get(`/rest/api/content/${args.pageId}`, {
      params: { expand: 'version' },
    });

    const currentVersion = currentResponse.data.version.number;

    const payload: any = {
      id: args.pageId,
      type: 'page',
      title: args.title || currentResponse.data.title, // 如果未提供新标题，保持原有标题
      body: args.content ? {
        storage: {
          value: args.content,
          representation: 'storage',
        },
      } : currentResponse.data.body, // 如果未提供新内容，保持原有内容
      version: { number: currentVersion + 1 }, // 版本号递增
    };

    await this.axiosInstance.put(`/rest/api/content/${args.pageId}`, payload);

    return {
      content: [
        {
          type: 'text',
          text: '页面更新成功。',
        },
      ],
    };
  }

  // ==================== 搜索处理方法 ====================

  /**
   * 在Confluence中搜索指定内容
   * @param args 包含查询关键词、可选空间限制和结果数量限制的参数
   * @returns 搜索结果的JSON响应
   */
  private async handleSearchContent(args: { query: string; spaceKey?: string; limit?: number }) {
    // 构建CQL查询语句：支持全空间搜索或限定空间搜索
    const cql = args.spaceKey ? `space = "${args.spaceKey}" AND text ~ "${args.query}"` : `text ~ "${args.query}"`;

    const response = await this.axiosInstance.post('/rest/api/search?cql=' + encodeURIComponent(cql) + `&limit=${args.limit || 10}`, {});

    const results = response.data.results.map((result: any) => ({
      id: result.content.id,
      title: result.content.title,
      type: result.content.type,
      space: result.content.space,
      url: result.url,
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  /**
   * 启动服务器并连接到std IO传输层
   */
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Confluence MCP服务器正在stdio上运行');
  }
}

const server = new ConfluenceServer();
server.run().catch(console.error);
