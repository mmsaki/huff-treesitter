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
  "prevrandao",
  "gaslimit",
  "chainid",
  "selfbalance",
  "basefee",
  "blobhash",
  "blobbasefee",
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
]

module.exports = grammar({
  name: "huff",
  rules: {
    source_file: $ => repeat($._definition),
    _definition: $ => choice(
      $.comment,
      $.declaration,
      $.decorator,
      $.import,
      $.natspec,
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
    natspec_line: _ => token(seq(
      "///",
      /.*/
    )),
    natspec_block: _ => token(seq(
      "/**",
      repeat(choice(
        /[^*]+/,
        /\*[^/]/
      )),
      "*/"
    )),
    comment: $ => choice(
      $._comment_line,
      $._comment_block,
    ),
    _comment_line: _ => token(seq("//", /.*/)),
    _comment_block: _ => seq(
      "/*",
      repeat(/[^*]|(\*[^/])/),
      "*/",
    ),
    decorator: $ => seq(
      "#[",
      sep1($.decorator_item, ","),
      "]"
    ),
    decorator_item: $ => seq(
      field("name", $.identifier),
      optional(seq(
        "(",
        field("args", sep1(choice($.string_literal, $.number, $.identifier), ",")),
        ")"
      ))
    ),
    _define_keyword: _ => field("define_keyword", "#define"),
    _include_keyword: _ => field("include_keyword", "#include"),
    import: $ => seq(
      $._include_keyword,
      field("path", $.string_literal)
    ),
    identifier: _ =>/[a-zA-Z_][a-zA-Z0-9_]*/,
    string_literal: _ => choice(
      /\"([^\"\\\\]|\\\\.)*\"/,
      /'([^'\\\\]|\\\\.)*'/
    ),
    number: $ => choice(
      $._number_decimal,
      $._number_hex
    ),
    _number_decimal: _ => token(/\d(_?\d)*/),
    _number_hex: _ => token(/0[xX][\da-fA-F](_?[\da-fA-F])*/),
    macro: $ => prec.right(seq(
      "macro",
      field("name", $.identifier),
      seq(
        "(",
        optional(field("parameters", sep1($.identifier, ","))),
        ")"
      ),
      seq(
        "=",
        field("takes_keyword", "takes"),
        "(",
        field("takes_count", $.number),
        ")",
        optional(seq(
          field("returns_keyword", "returns"),
          "(",
          field("returns_count", $.number),
          ")"
        ))
      ),
      $.macro_body
    )),
    fn: $ => prec.right(seq(
      "fn",
      field("name", $.identifier),
      seq(
        "(",
        optional(field("parameters", sep1($.identifier, ","))),
        ")"
      ),
      seq(
        "=",
        field("takes_keyword", "takes"),
        "(",
        field("takes_count", $.number),
        ")",
        optional(seq(
          field("returns_keyword", "returns"),
          "(",
          field("returns_count", $.number),
          ")"
        ))
      ),
      $.macro_body
    )),
    jumptable: $ => seq(
      "jumptable",
      field("name", $.identifier),
      $.jumptable_body
    ),
    jumptable_packed: $ => seq(
      "jumptable__packed",
      field("name", $.identifier),
      $.jumptable_body
    ),
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
      $.visibility,
      seq(
        "returns",
        field("parameters", $.parameter_list)
      )
    ),
    parameter_list: $ => seq(
      "(",
      optional(sep1($.parameter, ",")),
      ")"
    ),
    parameter: $ => seq(
      $.type,
      optional($.location),
      optional(field("name", $.identifier))
    ),
    event: $ => seq(
      "event",
      field("name", $.identifier),
      field("parameters", $.parameter_list)
    ),
    visibility: _ => field("visibility",choice(
      "pure",
      "view",
      "nonpayable",
      "payable")),
    location: _ => field("location", choice(
        "calldata", 
        "indexed",
        "memory", 
        "storage", 
      )
    ),
    type: $ => prec.right(1, seq(
      choice(
        "address", 
        "bool", 
        "bytes", 
        "int", 
        "string", 
        "uint",
        /uint(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)/,
        /int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)/,
        /bytes(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32)/
      ),
      repeat(seq(
        "[",
        optional(field("array_size", $.number)),
        "]"
      ))
    )),
    opcode: _ => choice(
      field("opcode", choice(...opcodes)),
    ),
    macro_call: $ => seq(
      field("name", $.identifier),
      seq(
        "(",
        optional(field("args", sep1(choice($.number, $.identifier), ","))),
        ")"
      )
    ),
    constant: $ => seq(
      "constant",
      field("name", $.identifier),
      "=",
      field("value", choice($.number, $.builtin_function))
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
    jumpdest: $ => field("name", $.identifier),
    jumpdest_label: $ => seq(
      field("name", $.identifier),
      ":"
    ),
    macro_body: $ => seq(
      "{",
      repeat($._macro_body_patterns),
      "}"
    ),
    _macro_body_patterns: $ => choice(
      $.builtin_function,
      $.comment,
      $.jumpdest,
      $.jumpdest_label,
      $.macro_call,
      $.natspec,
      $.number,
      $.opcode,
      $.referenced_constant,
      $.referenced_parameter,
    ),
    table: $ => seq(
      "table",
      field("name", $.identifier),
      field("body", $.macro_body)
    ),
    test: $ => seq(
      "test",
      field("name", $.identifier),
      optional(seq(
        "(",
        optional(field("parameters", sep1($.identifier, ","))),
        ")"
      )),
      "=",
      field("body", $.macro_body)
    ),
    builtin_function: $ => choice(
      $._codesize,
      $._error_hash,
      $._event_hash,
      $._func_sig,
      $._rightpad,
      $._storage_pointer,
      $._tablesize,
      $._tablestart,
    ),
    _codesize: $ => seq(
      "__codesize", 
      "(", 
      field("args", $.identifier),
      ")"
    ),
    _error_hash: $ => seq(
      "__ERROR", 
      "(", 
      field("args", choice($.identifier, $.string_literal)),
      ")"
    ),
    _event_hash: $ => seq(
      "__EVENT_HASH", 
      "(", 
      field("args", choice($.identifier, $.string_literal)),
      ")"
    ),
    _func_sig: $ => seq(
      "__FUNC_SIG", 
      "(", 
      field("args", choice($.identifier, $.string_literal)),
      ")"
    ),
    _rightpad: $ => seq(
      "__RIGHTPAD", 
      "(", 
      field("args", $.number),
      ")"
    ),
    _storage_pointer: _ => "FREE_STORAGE_POINTER()",
    _tablestart: $ => seq(
      "__tablestart", 
      "(", 
      field("args", $.identifier),
      ")"
    ),
    _tablesize: $ => seq(
      "__tablesize", 
      "(", 
      field("args", $.identifier),
      ")"
    ),
  }
});

function sep1(rule, sep) {
  return seq(rule, repeat(seq(sep, rule)));
}
