/**
 * @file Tree-sitter grammar for the EVM Huff language
 * @author Meek Msaki <meek10x@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "huff",
  rules: {
    // entry point
    source_file: $ => repeat($._patterns),
    _patterns: $ => choice(
      $.natspec,
      $.comment,
      $.number,
      $.declaration,
      $.interface,
      $.error,
      $.control,
      $.jumpdest,
      $.opcode,
      $.macro_call,
      $.constant,
      $.jumpdest_label,
      $.macro_body,
      $.decorator,
      $.builtin_function,
    ),
    natspec: $ => choice(
      $.natspec_line,
      $.natspec_block,
    ),
    natspec_line: $ => token(seq(
      "///",
      /.*/
    )),
    natspec_block: $ => token(seq(
      "/**",
      repeat(choice(
        /[^*]+/,
        /\*[^/]/
      )),
      "*/"
    )),
    natspec_tags: $ => choice(
      $.natspec_tag_title,
      $.natspec_tag_author,
      $.natspec_tag_notice,
      $.natspec_tag_dev,
      $.natspec_tag_param,
      $.natspec_tag_return
    ),
    natspec_tag_title: $ => token(/@title/),
    natspec_tag_author: $ => token(/@author/),
    natspec_tag_notice: $ => token(/@notice/),
    natspec_tag_dev: $ => token(/@dev/),
    natspec_tag_param: $ => prec.right(seq(
      field("keyword", "@param"),
      optional(field("param_name", $.identifier)),
      optional(field("description", /[^\n\r*]*/)),
    )),
    natspec_tag_return: $ => prec.right(seq(
      field("keyword", "@return"),
      optional(field("param_name", $.identifier)),
      optional(field("description", /[^\n\r*]*/)),
    )),
    identifier: $ => /[A-Za-z_]\w*/,
    comment_line: $ => token(seq("//", /.*/)),
    comment_block: $ => seq(
      "/*",
      repeat(/[^*]|(\*[^/])/),
      "*/",
    ),
    comment: $ => choice(
      $.comment_line,
      $.comment_block,
    ),
    control: $ => choice(
      $.control_import,
      $.control_include
    ),
    control_import: $ => token("#include"),
    control_include: $ => seq(
      "#include",
      field("path", $.string_literal)
    ),
    number: $ => choice(
      $.number_decimal,
      $.number_hex
    ),
    number_decimal: $ => token(/\d+(\.\d+)?/),
    number_hex: $ => token(/0[xX][a-fA-F0-9]+/),
    declaration: $ => choice(
      $.declaration_macro,
      $.declaration_fn,
      $.declaration_jumptable,
      $.declaration_jumptable_packed,
      $.declaration_table,
      $.declaration_test
    ),
    declaration_macro: $ => prec.right(seq(
      field("define_keyword", "#define"),
      field("type_keyword", "macro"),
      field("name", $.identifier),
      optional(seq(
        "(",
        optional(field("template_parameters", sep1($.identifier, ","))),
        ")"
      )),
      optional(seq(
        "=",
        field("takes_keyword", "takes"),
        "(",
        field("takes_count", $.number_decimal),
        ")",
        optional(seq(
          field("returns_keyword", "returns"),
          "(",
          field("returns_count", $.number_decimal),
          ")"
        ))
      )),
      optional($.macro_body)
    )),
    declaration_fn: $ => prec.right(seq(
      field("define_keyword", "#define"),
      field("type_keyword", "fn"),
      field("name", $.identifier),
      optional(seq(
        "(",
        optional(field("param_name", $.identifier)),
        ")"
      )),
      optional(seq(
        "=",
        field("takes_keyword", "takes"),
        "(",
        field("takes_count", $.number_decimal),
        ")",
        optional(seq(
          field("returns_keyword", "returns"),
          "(",
          field("returns_count", $.number_decimal),
          ")"
        ))
      )),
      optional($.macro_body)
    )),
    declaration_jumptable: $ => seq(
      field("define_keyword", "#define"),
      field("type_keyword", "jumptable"),
      field("name", $.identifier),
      field("body", $.jumptable_body)
    ),
    jumptable_body: $ => seq(
      "{",
      repeat($.identifier),
      "}"
    ),
    declaration_jumptable_packed: $ => seq(
      field("define_keyword", "#define"),
      field("type_keyword", "jumptable__packed"),
      field("name", $.identifier)
    ),
    error: $ => $.error_definition,
    error_definition: $ => seq(
      field("define_keyword", "#define"),
      field("type_keyword", "error"),
      field("name", $.identifier),
      optional(field("parameters", $.parameter_list))
    ),
    interface: $ => choice(
      $.interface_function,
      $.interface_event,
      $.interface_primitives,
      $.interface_extensions
    ),
    interface_function: $ => prec.right(seq(
      field("define_keyword", "#define"),
      field("type_keyword", "function"),
      field("name", $.identifier),
      field("parameters", $.parameter_list),
      optional(field("visibility", choice("external", "internal", "public", "private"))),
      optional(field("mutability", choice("view", "pure", "nonpayable", "payable"))),
      optional(seq(
        "returns",
        field("returns", $.parameter_list)
      ))
    )),
    parameter_list: $ => seq(
      "(",
      optional(sep1($.parameter, ",")),
      ")"
    ),
    parameter: $ => seq(
      $.interface_primitives,
      optional(field("location", choice("memory", "storage", "calldata"))),
      optional(field("modifier", alias("indexed", $.modifier_indexed))),
      optional(field("name", $.identifier))
    ),
    modifier_indexed: $ => "indexed",
    interface_event: $ => seq(
      field("define_keyword", "#define"),
      field("type_keyword", "event"),
      field("name", $.identifier),
      field("parameters", $.parameter_list)
    ),
    interface_primitives: $ => field("type", choice(
      // Array types (must come first to avoid conflict)
      token(seq(
        choice(
          "string", "bytes", "bool", "address",
          /uint(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)/,
          /int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)/,
          /bytes(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32)/
        ),
        "[",
        optional(/\d+/),
        "]"
      )),
      // Primitive types
      token(choice(
        "string", "bytes", "bool", "address",
        /uint(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)/,
        /int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)/,
        /bytes(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32)/
      ))
    )),
    interface_extensions: $ => field("modifier", token(/(nonpayable|view)/)),
    predeclaration_template: $ => seq(
      field("keyword", "template"),
      "<",
      field("parameters", sep1($.identifier, ",")),
      ">"
    ),
    opcode: $ => choice(
      field("opcode", choice(
        // Individual opcode keywords
        "lt", "gt", "slt", "sgt", "eq", "iszero", "and", "origin", "or", "xor", "not", "sha3",
        "address", "balance", "caller", "callvalue", "calldataload", "calldatasize", "calldatacopy",
        "codesize", "codecopy", "basefee", "blobhash", "blobbasefee", "blockhash", "coinbase",
        "timestamp", "number", "difficulty", "prevrandao", "gaslimit", "chainid", "selfbalance",
        "pop", "mload", "mstore8", "mstore", "sload", "sstore", "jumpdest", "jumpi", "jump", "pc",
        "msize", "stop", "addmod", "add", "mulmod", "mul", "sub", "div", "sdiv", "mod", "smod",
        "exp", "signextend", "byte", "shl", "shr", "sar", "gasprice", "extcodesize", "extcodecopy",
        "returndatasize", "returndatacopy", "extcodehash", "gas", "log0", "log1", "log2", "log3",
        "log4", "tload", "tstore", "mcopy", "create2", "create", "callcode", "call", "return",
        "delegatecall", "staticcall", "revert", "invalid", "selfdestruct",
        "push32", "push31", "push30", "push29", "push28", "push27", "push26", "push25", "push24",
        "push23", "push22", "push21", "push20", "push19", "push18", "push17", "push16", "push15",
        "push14", "push13", "push12", "push11", "push10", "push9", "push8", "push7", "push6",
        "push5", "push4", "push3", "push2", "push1", "push0",
        "swap16", "swap15", "swap14", "swap13", "swap12", "swap11", "swap10", "swap9", "swap8",
        "swap7", "swap6", "swap5", "swap4", "swap3", "swap2", "swap1",
        "dup16", "dup15", "dup14", "dup13", "dup12", "dup11", "dup10", "dup9", "dup8", "dup7",
        "dup6", "dup5", "dup4", "dup3", "dup2", "dup1"
      )),
      $.template_parameter_call
    ),
    template_parameter_call: $ => field("parameter", token(/<\s*[A-Za-z0-9_]+\s*>/)),
    macro_call: $ => seq(
      field("name", $.identifier),
      optional(seq(
        "(",
        optional(field("args", sep1(choice($.number, $.identifier), ","))),
        ")"
      ))
    ),
    constant: $ => choice(
      $.constant_definition,
      $.constant_reference
    ),
    constant_definition: $ => seq(
      field("define_keyword", "#define"),
      field("type_keyword", "constant"),
      field("name", $.identifier),
      "=",
      field("value", choice($.number, $.macro_call))
    ),
    constant_reference: $ => seq(
      "[",
      field("name", /[A-Z_]+/),
      "]"
    ),
    jumpdest: $ => prec(1, seq(
      field("name", $.identifier),
      choice(
        seq(field("opcode", "jumpi")),
        seq(field("opcode", "jump"))
      )
    )),
    jumpdest_label: $ => seq(
      field("name", $.identifier),
      ":"
    ),
    macro_body: $ => seq(
      "{",
      repeat($._patterns),
      "}"
    ),
    declaration_table: $ => seq(
      field("define_keyword", "#define"),
      field("type_keyword", "table"),
      field("name", $.identifier),
      field("body", $.macro_body)
    ),
    declaration_test: $ => seq(
      field("define_keyword", "#define"),
      field("type_keyword", "test"),
      field("name", $.identifier),
      optional(seq(
        "(",
        optional(field("parameters", sep1($.identifier, ","))),
        ")"
      )),
      "=",
      field("body", $.macro_body)
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
    string_literal: $ => choice(
      /\"([^\"\\\\]|\\\\.)*\"/,
      /'([^'\\\\]|\\\\.)*'/
    ),
    builtin_function: $ => seq(
      field("name", choice(
        "__ERROR",
        "__EVENT_HASH",
        "__FUNC_SIG",
        "__RIGHTPAD",
        "__codesize",
        "__tablesize",
        "__tablestart"
      )),
      "(",
      field("args", sep1(choice($.identifier, $.number, $.string_literal), ",")),
      ")"
    ),
  }
});

function sep1(rule, sep) {
  return seq(rule, repeat(seq(sep, rule)));
}
