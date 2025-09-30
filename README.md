# Confluence MCP Server

An MCP (Model Context Protocol) server provides tools for managing Confluence pages, enabling AI assistants to interact with Confluence content programmatically.

> **中文文档** | [中文版 README](./README-CN.md)

## Features

- **Space Management**: Get all Confluence spaces and their pages
- **Page Operations**: Read, create, and update Confluence pages
- **Content Search**: Search for content within Confluence spaces

## 🚀 How to Install and Configure

### 📋 System Requirements

- **Node.js**: 16.0 or later
- **Confluence access permissions**: Valid Confluence account access permissions required

### 📦 Installation Steps

```bash
# Clone the project
git clone https://github.com/sansong089/confluence-mcp-server.git
cd confluence-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

### ⚙️ Configuration

#### Claude Desktop

Add to your `claude_desktop_config.json`:

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

Add to your Cline MCP settings:

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

**Note:** Replace the path with the actual path to the built `build/confluence-server/index.js` file. Some Confluence instances may require API tokens instead of passwords - check your Confluence authentication method.

### ✅ Verification

After setup, ask your AI assistant to list available tools. You should see Confluence-related tools like `get_spaces`, `create_page`, etc.

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
└── confluence-server/       # MCP protocol handling
  └── index.ts               # Main server implementation
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## ⚠️ Important Disclaimer

**Critical Warning: Modification and deletion operations must NEVER be authorized for automatic execution by AI assistants**

**Please read the following terms carefully:**

1. **Usage Restrictions**
   - This software is for learning, development, and testing purposes only
   - Do not use in unauthorized production environments

2. **Risk Warnings**
   - Users must bear all consequences of operations themselves
   - Including but not limited to data loss, service interruption, etc.

3. **Security Warnings**
   - **Modification and deletion operations must NEVER be authorized for automatic execution by AI assistants**
   - All destructive operations must go through manual confirmation and review
   - Operations with Confluence administrative privileges may cause serious security risks
   - Please run in secure and controllable environments

4. **Disclaimer**
   - This project is provided "as is" without any express or implied warranties
   - The author is not responsible for any damages caused by using this software

**Please ensure you understand and accept the above terms before use.**

--------
