;; ==========================
;; Huff Tree-sitter Highlights
;; Matches naming scheme from source.huff
;; ==========================

;; --------------------------
;; Natspec / Documentation
;; --------------------------
(natspec_line) @comment.block.documentation.huff
(natspec_block) @comment.block.documentation.huff

(natspec_tag_title) @storage.type.title.natspec
(natspec_tag_author) @storage.type.author.natspec
(natspec_tag_notice) @storage.type.notice.natspec
(natspec_tag_dev) @storage.type.dev.natspec
(natspec_tag_param) @storage.type.param.natspec
(natspec_tag_return) @storage.type.return.natspec

(comment_line) @comment.line.huff
(comment_block) @comment.block.huff

;; --------------------------
;; Declarations - Storage Keywords
;; --------------------------
"#define macro" @storage.macro.huff
"#define fn" @storage.macro.huff
"#define jumptable" @storage.macro.huff
"#define jumptable__packed" @storage.macro.huff
"#define function" @storage.function.huff
"#define event" @storage.event.huff
"#define error" @storage.function.huff
"#define constant" @storage.constant.huff
"#define table" @storage.macro.huff
"#define test" @storage.macro.huff

"takes" @storage.takes.huff
"returns" @storage.returns.huff

;; --------------------------
;; Function/Macro Names
;; --------------------------
(declaration_macro name: (identifier) @entity.name.function.huff)
(declaration_fn name: (identifier) @entity.name.function.huff)
(declaration_jumptable name: (identifier) @entity.name.function.huff)
(declaration_jumptable_packed name: (identifier) @entity.name.function.huff)
(declaration_table name: (identifier) @entity.name.function.huff)
(declaration_test name: (identifier) @entity.name.function.huff)
(interface_function name: (identifier) @entity.name.function.huff)
(interface_event name: (identifier) @entity.name.function.huff)
(error_definition name: (identifier) @entity.name.function.huff)

;; --------------------------
;; Interface Types and Extensions
;; --------------------------
(interface_primitives) @variable.parameter
"view" @storage.type.interface.huff
"pure" @storage.type.interface.huff
"payable" @storage.type.interface.huff
"nonpayable" @storage.type.interface.huff
"external" @storage.type.interface.huff
"internal" @storage.type.interface.huff
"public" @storage.type.interface.huff
"private" @storage.type.interface.huff
"memory" @keyword.modifier.huff
"storage" @keyword.modifier.huff
"calldata" @keyword.modifier.huff

;; --------------------------
;; Opcodes - Single category for now
;; --------------------------
(opcode) @entity.name.function.inputs.huff

;; --------------------------
;; Template Parameters
;; --------------------------
(template_parameter_call) @variable.parameter

;; --------------------------
;; Macro Calls
;; --------------------------
(macro_call name: (identifier) @entity.name.function.huff)

;; --------------------------
;; Constants
;; --------------------------
(constant_definition name: (identifier) @constant.name.huff)
(constant_reference) @constant.name.huff

;; --------------------------
;; Numbers
;; --------------------------
(number_decimal) @constant.numeric.decimal.huff
(number_hex) @constant.numeric.hexadecimal.huff

;; --------------------------
;; Jump Targets/Labels
;; --------------------------
(jumpdest_label name: (identifier) @entity.name.function.huff)
(jumpdest name: (identifier) @entity.name.function.huff)
(jumptable_body (identifier) @entity.name.function.huff)

;; --------------------------
;; Builtin Functions
;; --------------------------
(builtin_function) @support.function.builtin.huff
"__ERROR" @support.function.builtin.huff
"__EVENT_HASH" @support.function.builtin.huff
"__FUNC_SIG" @support.function.builtin.huff
"__RIGHTPAD" @support.function.builtin.huff
"__codesize" @support.function.builtin.huff
"__tablesize" @support.function.builtin.huff
"__tablestart" @support.function.builtin.huff

;; --------------------------
;; Control/Import
;; --------------------------
"#include" @keyword.control.import.huff
(control_include path: (string_literal) @string.quoted.double.huff)

;; --------------------------
;; Parameter Modifiers
;; --------------------------
(modifier_indexed) @keyword.modifier.huff

;; --------------------------
;; String Literals
;; --------------------------
(string_literal) @string.quoted.double.huff

;; --------------------------
;; Decorators
;; --------------------------
(decorator) @meta.annotation.huff
(decorator_item name: (identifier) @meta.annotation.huff)
(decorator_item args: (string_literal) @string.quoted.double.huff)
(decorator_item args: (number) @constant.numeric.decimal.huff)

;; --------------------------
;; Operators and Punctuation
;; --------------------------
"=" @keyword.operator.assignment.huff
":" @punctuation.separator.huff
"," @punctuation.separator.huff
"(" @punctuation.bracket.round.huff
")" @punctuation.bracket.round.huff
"{" @punctuation.bracket.curly.huff
"}" @punctuation.bracket.curly.huff
"[" @punctuation.bracket.square.huff
"]" @punctuation.bracket.square.huff
"#[" @punctuation.bracket.square.huff

;; --------------------------
;; Generic Identifiers (fallback)
;; --------------------------
(identifier) @variable.other.readwrite.huff
