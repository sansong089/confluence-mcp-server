# Confluence MCP Server

An MCP (Model Context Protocol) server provides tools for managing Confluence pages, enabling AI assistants to interact with Confluence content programmatically.

> **中文文档** | [中文版 README](./README-CN.md)

## Features

- **Space Management**: Get all Confluence spaces and their pages
- **Page Operations**: Read, create, and update Confluence pages
- **Content Search**: Search for content within Confluence spaces

## Cline Installation

This MCP server is designed to work with **Cline** (in VSCode/Cursor) or **Claude Desktop**.

### Option 1: Cline (VSCode/Cursor Extension)

1. **Clone the repository**:

```bash
git clone https://github.com/sansong089/confluence-mcp-server.git
cd confluence-mcp-server
```

2. **Install dependencies and build**:

```bash
npm install
npm run build
```

3. **Configure Cline MCP settings**:

Add the server to your Cline MCP configuration (usually in VSCode settings):

```json
{
  "cline.mcp.remoteServers": {
    "confluence-mcp-server": {
      "command": "node",
      "args": ["/absolute/path/to/confluence-mcp-server/build/index.js"],
      "env": {
        "CONFLUENCE_URL": "https://your-confluence-instance.atlassian.net",
        "CONFLUENCE_USERNAME": "your-email@example.com",
        "CONFLUENCE_PASSWORD": "your-password"
      }
    }
  }
}
```

### Option 2: Claude Desktop

1. **Clone the repository**:

```bash
git clone https://github.com/sansong089/confluence-mcp-server.git
cd confluence-mcp-server
```

2. **Install dependencies and build**:

```bash
npm install
npm run build
```

3. **Configure Claude Desktop**:

Edit your Claude Desktop configuration file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "confluence-mcp-server": {
      "command": "node",
      "args": ["/absolute/path/to/confluence-mcp-server/build/index.js"],
      "env": {
        "CONFLUENCE_URL": "https://your-confluence-instance.atlassian.net",
        "CONFLUENCE_USERNAME": "your-email@example.com",
        "CONFLUENCE_PASSWORD": "your-password"
      }
    }
  }
}
```

### Environment Variables (Both Options)

Required environment variables:

- `CONFLUENCE_URL`: Your Confluence instance URL (e.g., `https://company.atlassian.net`)
- `CONFLUENCE_USERNAME`: Your Atlassian account email
- `CONFLUENCE_PASSWORD`: Your Atlassian account password

### Verification

After setup, ask your AI assistant to list available tools. You should see Confluence-related tools like `get_spaces`, `create_page`, etc.

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

> **Note**: Use your Atlassian account email as username and password for authentication. Some Confluence instances may require API tokens - check your Confluence authentication method.

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

## Disclaimer

### ⚠️ Important Safety Warning

**This project implements a simple solution with minimal security controls and no advanced permission restrictions, designed primarily for easy installation and testing purposes.**

#### ⚠️ Critical Limitations
- **No Permission Validation**: The tool performs operations directly without checking user permissions on Confluence
- **No Access Controls**: Any configured user can perform all operations (create, update, delete)
- **Simple Authentication**: Uses basic HTTP authentication only

#### ⚠️ AI Assistant Usage Restrictions
**The modification and deletion operations provided by this tool MUST NOT be used for automatic approval by AI assistants.** All write operations (create, update, delete) require:

- **Manual Human Review**: Each operation should be reviewed by a human operator
- **Explicit Approval**: Human confirmation before executing any destructive operations
- **Data Backup**: Ensure Confluence content is backed up before any operations

#### ⚠️ Data Safety Risks
- **Potential Data Loss**: Incorrect usage may result in accidental content deletion or corruption
- **No Rollback**: Some operations may not be easily reversible through this tool
- **Limited Error Recovery**: Basic error handling may not cover all edge cases

#### ⚠️ Responsibility
Users are solely responsible for:
- Understanding the implications of each operation
- Ensuring proper authorization for all changes
- Maintaining backups of critical content
- Complying with their organization's data management policies

**By using this tool, you acknowledge these limitations and accept full responsibility for any consequences arising from its use.**

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
