# Tree-sitter Huff

Tree-sitter grammar for the [Huff](https://huff.sh) programming language.

## Installation

```bash
git clone https://github.com/your-username/tree-sitter-huff
cd tree-sitter-huff
tree-sitter generate
```

## Features

- **Syntax highlighting** for all Huff language constructs
- **Auto-indentation** support
- **Code folding** for macros, functions, and comment blocks

## Language Support

This grammar supports all Huff language features:

- Declarations
  - `#define macro` - Macro definitions
  - `#define fn` - Function definitions  
  - `#define constant` - Constants
  - `#define table` - Jump tables
  - `#define test` - Test definitions

- Interface Definitions
  - `#define function` - External function interfaces
  - `#define event` - Event definitions
  - `#define error` - Error definitions

Comments & Documentation
    - `//` - Line comments
    - `/* */` - Block comments  
    - `///` - Natspec line comments
    - `/** */` - Natspec block comments

- Keyword and buildins
  - EVM opcodes (`add`, `mul`, `sstore`, etc.)
  - Jump labels and destinations
  - Builtin functions (`__FUNC_SIG`, `__EVENT_HASH`, etc.)
  - Template parameters
  - Decorators

## Development

1. Building

    ```bash
    tree-sitter generate
    tree-sitter test
    ```

1. Testing

    ```bash
    tree-sitter test
    ```

    > All tests should pass. The test suite covers basic syntax, advanced features, interfaces, and edge cases.

1. This parser includes bindings for:

    - Node.js
    - Python
    - Go
    - Rust
    - Swift
    - C

## Examples

- Basic Macro

    ```huff
    #define macro MAIN() = takes(0) returns(0) {
        0x04 calldataload
        0x01 add
        0x00 mstore
        0x20 0x00 return
    }
    ```

- Interface Definition

    ```huff
    #define function balanceOf(address) view returns(uint256)
    #define event Transfer(address indexed from, address indexed to, uint256 value)
    ```

- Constants and Tables

    ```huff
    #define constant OWNER = 0x1234567890123456789012345678901234567890
    #define table JUMP_TABLE {
        label1 label2 label3
    }
    ```

## License

MIT
