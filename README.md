# Confluence MCP Server

An MCP (Model Context Protocol) server provides tools for managing Confluence pages, enabling AI assistants to interact with Confluence content programmatically.

> **中文文档** | [中文版 README](./README-CN.md)

## Features

- **Space Management**: Get all Confluence spaces and their pages
- **Page Operations**: Read, create, and update Confluence pages
- **Content Search**: Search for content within Confluence spaces

## Installation

### Prerequisites

- Node.js 16 or later
- Access to a Confluence instance

### Install Dependencies

```bash
npm install
```

### Build the Project

```bash
npm run build
```

## Configuration

Set the required environment variables:

```bash
export CONFLUENCE_URL="https://your-confluence-instance.atlassian.net"
export CONFLUENCE_USERNAME="your-username"
export CONFLUENCE_PASSWORD="your-api-token"
```

> **Note**: Use your Atlassian account email as username and an API token as password. You can create an API token from your Atlassian account settings.

## Usage

### Starting the Server

```bash
npm start
```

The server will start and listen on stdio for MCP protocol messages.

### Available Tools

#### Space Query Tools

- **get_spaces**: Get all Confluence spaces
  - Parameters: None

- **get_pages**: Get pages from a specific space
  - Parameters:
    - `spaceKey` (string, required): The key of the space to get pages from
    - `limit` (number, optional): Maximum number of pages to return (default: 25)

#### Page Operation Tools

- **read_page**: Read the content of a Confluence page
  - Parameters:
    - `pageId` (string, required): The ID of the page to read

- **create_page**: Create a new page in a Confluence space
  - Parameters:
    - `spaceKey` (string, required): The key of the space to create the page in
    - `title` (string, required): The title of the new page
    - `content` (string, required): The content of the new page (HTML format)
    - `parentId` (string, optional): The ID of the parent page

- **update_page**: Update an existing Confluence page
  - Parameters:
    - `pageId` (string, required): The ID of the page to update
    - `title` (string, optional): New title for the page
    - `content` (string, optional): New content for the page (HTML format)

#### Search Tools

- **search_content**: Search for content in Confluence
  - Parameters:
    - `query` (string, required): The search query
    - `spaceKey` (string, optional): Filter results to a specific space
    - `limit` (number, optional): Maximum number of results to return (default: 10)

## Development

### Project Structure

```
src/
└── mcp-server/              # MCP协议处理
  └── index.ts               # 主服务器实现
```

### Building

```bash
npm run build
```

This will compile TypeScript files to JavaScript in the `build/` directory.

### Code Style

The project uses TypeScript with the following conventions:

- Use `async/await` for asynchronous operations
- Proper error handling with try/catch blocks
- TypeScript interfaces for all data structures
- JSDoc comments for documentation

## API Rate Limits

Be aware of Confluence API rate limits. The server includes timeout settings but you should monitor your usage to avoid hitting rate limits.

## Error Handling

The server provides user-friendly error messages for common issues:

- Authentication failures
- Invalid parameters
- Network timeouts
- API errors

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

If you encounter issues or need help:

1. Check the environment variables are correctly set
2. Verify your Confluence instance URL and credentials
3. Ensure you have the necessary permissions in Confluence
4. Check the server logs for detailed error information
