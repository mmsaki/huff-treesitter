/**
 * @file Tree-sitter grammar for the EVM Huff language
 * @author Meek Msaki <meek10x@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const opcodes = [
  // Arithmetic Ops
  "add",
  "mul",
  "sub",
  "div",
  "sdiv",
  "mod",
  "smod",
  "addmod",
  "mulmod",
  "exp",
  "signextend",
  "clz",
  "keccak256",
  // Comparison Ops
  "lt",
  "gt",
  "slt",
  "sgt",
  "eq",
  "iszero",
  // Bitwise Ops
  "and",
  "or",
  "xor",
  "not",
  "byte",
  "shl",
  "shr",
  "sar",
  // kECCAK oP
  "sha3",
  // Environmental Ops
  "address",
  "balance",
  "origin",
  "caller",
  "callvalue",
  "calldataload",
  "calldatasize",
  "calldatacopy",
  "codesize",
  "codecopy",
  "gasprice",
  "extcodesize",
  "extcodecopy",
  "returndatasize",
  "returndatacopy",
  "extcodehash",
  // Block Ops
  "blockhash",
  "coinbase",
  "timestamp",
  "number",
  "difficulty",
  "prevrandao",
  "gaslimit",
  "chainid",
  "selfbalance",
  "basefee",
  "blobhash",
  "blobbasefee",
  "slotnum",
  // Control Flow Ops
  "stop",
  "jump",
  "jumpi",
  "pc",
  "gas",
  "jumpdest",
  // Storage Ops
  "sload",
  "sstore",
  "tload",
  "tstore",
  // Pop Operation
  "pop",
  // Push Operations
  "push0",
  "push1",
  "push2",
  "push3",
  "push4",
  "push5",
  "push6",
  "push7",
  "push8",
  "push9",
  "push10",
  "push11",
  "push12",
  "push13",
  "push14",
  "push15",
  "push16",
  "push17",
  "push18",
  "push19",
  "push20",
  "push21",
  "push22",
  "push23",
  "push24",
  "push25",
  "push26",
  "push27",
  "push28",
  "push29",
  "push30",
  "push31",
  "push32",
  // Dup operations
  "dup1",
  "dup2",
  "dup3",
  "dup4",
  "dup5",
  "dup6",
  "dup7",
  "dup8",
  "dup9",
  "dup10",
  "dup11",
  "dup12",
  "dup13",
  "dup14",
  "dup15",
  "dup16",
  // Swap operations
  "swap1",
  "swap2",
  "swap3",
  "swap4",
  "swap5",
  "swap6",
  "swap7",
  "swap8",
  "swap9",
  "swap10",
  "swap11",
  "swap12",
  "swap13",
  "swap14",
  "swap15",
  "swap16",
  // Deep stack operations (EIP-8024)
  "dupn",
  "swapn",
  "exchange",
  // Memory Operations
  "mload",
  "mstore",
  "mstore8",
  "msize",
  "mcopy",
  // Log Operations
  "log0",
  "log1",
  "log2",
  "log3",
  "log4",
  // System Operations
  "create",
  "call",
  "callcode",
  "return",
  "delegatecall",
  "create2",
  "staticcall",
  "revert",
  "selfdestruct",
  "invalid",
]

const builtins = [
  "__ASSERT_PC",
  "__BYTES",
  "__CODECOPY_DYN_ARG",
  "__ERROR",
  "__EVENT_HASH",
  "__FUNC_SIG",
  "__LEFTPAD",
  "__RIGHTPAD",
  "__VERBATIM",
  "__codesize",
]

const table_builtins = [
  "__EMBED_TABLE",
  "__tablesize",
  "__tablestart",
]

const sizes = Array.from({ length: 32 }, (_, i) => i + 1)
const types = [
  "address",
  "bool",
  "bytes",
  "function",
  "int",
  "string",
  "uint",
  ...sizes.map(n => `uint${n * 8}`),
  ...sizes.map(n => `int${n * 8}`),
  ...sizes.map(n => `bytes${n}`),
]

const PREC = {
  comparison: 1,
  additive: 2,
  multiplicative: 3,
  unary: 4,
  call: 5,
}

module.exports = grammar({
  name: "huff",
  word: $ => $.identifier,
  conflicts: $ => [
    [$.if_statement],
  ],
  extras: $ => [
    /\s/,
    $.comment,
    $.natspec,
  ],
  rules: {
    source_file: $ => repeat($._definition),
    _definition: $ => choice(
      $.declaration,
      $.decorator,
      $.import,
    ),
    declaration: $ => seq(
      $._define_keyword,
      choice(
        $.constant,
        $.error,
        $.event,
        $.fn,
        $.function,
        $.jumptable,
        $.jumptable_packed,
        $.macro,
        $.table,
        $.test,
      )
    ),
    natspec: $ => choice(
      $.natspec_block,
      $.natspec_line,
    ),
    natspec_line: _ => token(prec(1, seq("///", /[^\n]*/))),
    natspec_block: _ => token(prec(1, seq("/**", /[^*]*\*+([^/*][^*]*\*+)*/, "/"))),
    comment: _ => token(choice(
      seq("//", /[^\n]*/),
      seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
    )),
    // `#[a(1), b(2)]`, stacked blocks, trailing commas and the legacy
    // comma-less `#[a(1) b(2)]` form are all accepted by huff-neo.
    decorator: $ => seq(
      "#[",
      repeat(seq($.decorator_item, optional(","))),
      "]"
    ),
    decorator_item: $ => seq(
      field("name", $.identifier),
      optional(seq(
        "(",
        optional(seq(
          sep1(field("args", $._decorator_arg), ","),
          optional(","),
        )),
        ")"
      ))
    ),
    _decorator_arg: $ => choice(
      $._expression,
      $.identifier,
      $.named_argument,
      $.string_literal,
    ),
    named_argument: $ => seq(
      field("name", $.identifier),
      "=",
      field("value", choice($._expression, $.identifier, $.string_literal)),
    ),
    _define_keyword: _ => field("define_keyword", "#define"),
    _include_keyword: _ => field("include_keyword", "#include"),
    import: $ => seq(
      $._include_keyword,
      field("path", $.string_literal)
    ),
    identifier: _ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    string_literal: _ => choice(
      /"([^"\\]|\\.)*"/,
      /'([^'\\]|\\.)*'/
    ),
    number: $ => choice(
      $._number_decimal,
      $._number_hex
    ),
    _number_decimal: _ => token(/\d(_?\d)*/),
    _number_hex: _ => token(/0[xX][\da-fA-F](_?[\da-fA-F])*/),
    boolean: _ => choice("true", "false"),
    _macro_parameters: $ => seq(
      "(",
      optional(seq(
        field("parameters", sep1($.identifier, ",")),
        optional(","),
      )),
      ")"
    ),
    macro: $ => seq(
      "macro",
      field("name", $.identifier),
      $._macro_parameters,
      "=",
      optional($._takes_returns),
      $.macro_body
    ),
    _takes_returns: $ => choice(
      seq($._takes, optional($._returns)),
      $._returns,
    ),
    _takes: $ => seq(
      field("takes_keyword", "takes"),
      "(",
      field("takes_count", $.number),
      ")",
    ),
    _returns: $ => seq(
      field("returns_keyword", "returns"),
      "(",
      field("returns_count", $.number),
      ")"
    ),
    fn: $ => seq(
      "fn",
      field("name", $.identifier),
      $._macro_parameters,
      "=",
      optional($._takes_returns),
      $.macro_body
    ),
    jumptable: $ => seq(
      "jumptable",
      field("name", $.identifier),
      optional($._table_suffix),
      $.jumptable_body
    ),
    jumptable_packed: $ => seq(
      "jumptable__packed",
      field("name", $.identifier),
      optional($._table_suffix),
      $.jumptable_body
    ),
    // `()` and `=` after a table name are optional.
    _table_suffix: _ => choice(seq("(", ")", optional("=")), "="),
    jumptable_body: $ => seq(
      "{",
      repeat($.jumpdest),
      "}"
    ),
    error: $ => seq(
      "error",
      field("name", $.identifier),
      field("parameters", $.parameter_list)
    ),
    function: $ => seq(
      "function",
      field("name", $.identifier),
      field("parameters", $.parameter_list),
      optional($.visibility),
      optional(seq(
        "returns",
        field("parameters", $.parameter_list)
      ))
    ),
    parameter_list: $ => seq(
      "(",
      optional(sep1($.parameter, ",")),
      ")"
    ),
    parameter: $ => seq(
      choice($.type, $.tuple_type),
      optional($.location),
      optional(field("name", $.identifier))
    ),
    event: $ => seq(
      "event",
      field("name", $.identifier),
      field("parameters", $.parameter_list)
    ),
    visibility: _ => field("visibility", choice(
      "pure",
      "view",
      "nonpayable",
      "payable")),
    location: _ => field("location", choice(
      "calldata",
      "indexed",
      "memory",
      "storage",
    )),
    type: $ => seq(
      choice(...types),
      repeat($._array_suffix)
    ),
    tuple_type: $ => seq(
      $.parameter_list,
      repeat($._array_suffix)
    ),
    _array_suffix: $ => seq(
      "[",
      optional(field("array_size", $.number)),
      "]"
    ),
    opcode: _ => choice(
      field("opcode", choice(...opcodes)),
    ),
    // `MACRO(a, b)`. Arguments may be literals, constants, `<args>`, labels,
    // opcodes, builtins, nested invocations or compile-time expressions.
    macro_call: $ => prec(PREC.call, seq(
      field("name", $.identifier),
      $._call_arguments,
    )),
    // First-class macro invocation: `<fn>(<x>, 0x01)`.
    macro_invocation: $ => prec(PREC.call, seq(
      field("name", $.referenced_parameter),
      $._call_arguments,
    )),
    _call_arguments: $ => seq(
      "(",
      optional(field("args", sep1($._macro_arg, ","))),
      ")"
    ),
    _macro_arg: $ => choice(
      $._expression,
      $.identifier,
      $.macro_call,
      $.macro_invocation,
      $.opcode,
      $.string_literal,
    ),
    constant: $ => seq(
      "constant",
      field("name", $.identifier),
      "=",
      field("value", choice($._expression, $.identifier, $.string_literal))
    ),
    referenced_parameter: $ => seq(
      "<",
      field("name", $.identifier),
      ">"
    ),
    referenced_constant: $ => seq(
      "[",
      field("name", $.identifier),
      "]"
    ),
    jumpdest: $ => field("name", choice($.identifier, $._keyword_label)),
    jumpdest_label: $ => seq(
      field("name", choice($.identifier, $._keyword_label)),
      ":"
    ),
    // huff-neo allows `if`, `else` and `for` as label names when they are not
    // followed by `(` or `{`.
    _keyword_label: $ => alias(prec(-1, choice("if", "else", "for")), $.identifier),
    macro_body: $ => seq(
      "{",
      repeat($._macro_body_patterns),
      "}"
    ),
    block: $ => seq(
      "{",
      repeat($._macro_body_patterns),
      "}"
    ),
    _macro_body_patterns: $ => choice(
      $.boolean,
      $.builtin_function,
      $.for_statement,
      $.if_statement,
      $.jumpdest,
      $.jumpdest_label,
      $.macro_call,
      $.macro_invocation,
      $.noop,
      $.number,
      $.opcode,
      $.parenthesized_expression,
      $.referenced_constant,
      $.referenced_parameter,
      $.storage_pointer,
      $.string_literal,
    ),
    // Compile-time `if (cond) { } else if (cond) { } else { }`.
    if_statement: $ => seq(
      "if",
      "(",
      field("condition", $._expression),
      ")",
      field("consequence", $.block),
      optional(seq(
        "else",
        field("alternative", choice($.if_statement, $.block))
      ))
    ),
    // Compile-time `for (i in start..end step n) { }`.
    for_statement: $ => seq(
      "for",
      "(",
      field("variable", $.identifier),
      "in",
      field("start", $._expression),
      "..",
      field("end", $._expression),
      optional(seq("step", field("step", $._expression))),
      ")",
      field("body", $.block)
    ),
    _expression: $ => choice(
      $.binary_expression,
      $.boolean,
      $.builtin_function,
      $.noop,
      $.number,
      $.parenthesized_expression,
      $.referenced_constant,
      $.referenced_parameter,
      $.storage_pointer,
      $.unary_expression,
    ),
    parenthesized_expression: $ => seq("(", $._expression, ")"),
    unary_expression: $ => prec(PREC.unary, seq(
      field("operator", choice("-", "!")),
      field("operand", $._expression)
    )),
    binary_expression: $ => choice(
      ...[
        ["*", PREC.multiplicative],
        ["/", PREC.multiplicative],
        ["%", PREC.multiplicative],
        ["+", PREC.additive],
        ["-", PREC.additive],
        ["==", PREC.comparison],
        ["!=", PREC.comparison],
        ["<", PREC.comparison],
        [">", PREC.comparison],
        ["<=", PREC.comparison],
        [">=", PREC.comparison],
      ].map(([operator, precedence]) => prec.left(precedence, seq(
        field("left", $._expression),
        field("operator", operator),
        field("right", $._expression)
      )))
    ),
    table: $ => seq(
      "table",
      field("name", $.identifier),
      optional($._table_suffix),
      field("body", $.macro_body)
    ),
    test: $ => seq(
      "test",
      field("name", $.identifier),
      optional($._macro_parameters),
      "=",
      optional($._takes_returns),
      field("body", $.macro_body)
    ),
    builtin_function: $ => prec(PREC.call, choice(
      seq(
        field("name", choice(...table_builtins)),
        "(",
        field("table", $.identifier),
        ")"
      ),
      seq(
        field("name", choice(...builtins)),
        "(",
        optional(field("args", sep1($._builtin_arg, ","))),
        ")"
      ),
    )),
    _builtin_arg: $ => choice(
      $._expression,
      $.identifier,
      $.string_literal,
    ),
    noop: _ => "__NOOP",
    storage_pointer: _ => seq("FREE_STORAGE_POINTER", "(", ")"),
  }
});

function sep1(rule, sep) {
  return seq(rule, repeat(seq(sep, rule)));
}
