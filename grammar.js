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
      $.macro_call,
      $.opcodes,
      $.constant,
    ),
    natspec: $ => choice(
      $.natspec_line,
      $.natspec_block,
    ),
    natspec_line: $ => seq(
      "///",
      repeat(choice($.natspec_tags)),
    ),
    natspec_block: $ => seq(
      "/**",
      repeat($.natspec_tags),
      "*/",
    ),
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
    )),
    natspec_tag_return: $ => prec.right(seq(
      field("keyword", "@return"),
      optional(field("param_name", $.identifier)),
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
    control: $ => $.control_import,
    control_import: $ => token("#include"),
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
      $.declaration_jumptable_packed
    ),
    declaration_macro: $ => seq(
      field("keyword", "#define macro"),
      field("name", $.identifier),
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
      ))
    ),
    declaration_fn: $ => seq(
      field("keyword", "#define fn"),
      field("name", $.identifier),
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
      ))
    ),
    declaration_jumptable: $ => seq(
      field("keyword", "#define jumptable"),
      field("name", $.identifier)
    ),
    declaration_jumptable_packed: $ => seq(
      field("keyword", "#define jumptable__packed"),
      field("name", $.identifier)
    ),
    error: $ => $.error_definition,
    error_definition: $ => seq(
      field("keyword", "#define error"),
      field("name", $.identifier)
    ),
    interface: $ => choice(
      $.interface_function,
      $.interface_event,
      $.interface_primitives,
      $.interface_extensions
    ),
    interface_function: $ => seq(
      field("keyword", "#define function"),
      field("name", $.identifier),
      field("parameters", $.parameter_list),
      optional($.interface_extensions),
      "returns",
      field("returns", $.parameter_list)
    ),
    parameter_list: $ => seq(
      "(",
      sep1($.interface_primitives, ","),
      ")"
    ),
    interface_event: $ => seq(
      field("keyword", "#define event"),
      field("name", $.identifier)
    ),
    interface_primitives: $ => field("type", token(/(address|string\d*|bytes\d*|int\d*|uint\d*|bool|hash\d*)/)),
    interface_extensions: $ => field("modifier", token(/(nonpayable|view|returns)/)),
    predeclaration_template: $ => seq(
      field("keyword", "template"),
      "<",
      field("parameters", sep1($.identifier, ",")),
      ">"
    ),
    opcodes: $ => choice(
      $.opcodes_stop,
      $.opcodes_calculation,
      $.opcodes_stack,
      $.opcodes_io,
      $.template_parameter_call
    ),
    opcodes_io: $ => field("opcode", token(/(sstore|sload|mstore8|mstore|mload|pop|msize|balance|address|returndatacopy|returndatasize|extcodecopy|extcodesize|gasprice|caller|origin|gaslimit|difficulty|number|timestamp|coinbase|blockhash|codecopy|codesize|calldatacopy|calldatasize|calldataload|callvalue|gas)/)),
    opcodes_side_effects: $ => field("opcode", token(/(log4|log3|log2|log1|log0|jumpdest|getpc|jumpi|jump|create2|staticcall|delegatecall|callcode|call|create)/)),
    opcodes_calculation: $ => field("opcode", token(/(not|xor|or|and|ror|rol|sar|shr|shl|keccak|sha3|byte|iszero|eq|sgt|slt|gt|lt|signextend|exp|mulmod|addmod|smod|mod|sdiv|div|sub|mul|add)/)),
    opcodes_stop: $ => field("opcode", token(/(selfdestruct|invalid|revert|return|stop)/)),
    opcodes_stack: $ => field("opcode", token(/((swap1|dup1)[0-6]|(swap|dup)[1-9]|push3[0-2]|push[1-2][0-9]|push[0-9])/)),
    template_parameter_call: $ => field("parameter", token(/<\s*[A-Za-z0-9_]+\s*>/)),
    macro_call: $ => seq(
      field("name", $.identifier),
      optional(field("template_parameters", sep1($.identifier, ","))),
      "("
    ),
    constant: $ => choice(
      $.constant_definition,
      $.constant_reference
    ),
    constant_definition: $ => seq(
      field("keyword", "#define constant"),
      field("name", $.identifier)
    ),
    constant_reference: $ => seq(
      "[",
      field("name", /[A-Z_]+/),
      "]"
    ),
  }
});

function sep1(rule, sep) {
  return seq(rule, repeat(seq(sep, rule)));
}
