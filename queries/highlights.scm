;; ==========================
;; Huff Tree-sitter Highlights
;; ==========================

;; --------------------------
;; Natspec / Documentation
;; --------------------------
(natspec_line) @comment.documentation
(natspec_block) @comment.documentation

(natspec_tag_title) @keyword
(natspec_tag_author) @keyword
(natspec_tag_notice) @keyword
(natspec_tag_dev) @keyword
(natspec_tag_param) @keyword
(natspec_tag_return) @keyword

(comment_line) @comment
(comment_block) @comment

;; --------------------------
;; Declarations
;; --------------------------
(declaration_macro name: (identifier) @function.macro)
(declaration_fn name: (identifier) @function)
(declaration_jumptable name: (identifier) @constant)
(declaration_jumptable_packed name: (identifier) @constant)

;; Keywords for declarations
"#define macro" @keyword
"#define fn" @keyword  
"#define jumptable" @keyword
"#define jumptable__packed" @keyword
"#define function" @keyword
"#define event" @keyword
"#define error" @keyword
"#define constant" @keyword
"#define table" @keyword
"#define test" @keyword

"takes" @keyword
"returns" @keyword
"=" @operator

;; Function modifiers
"view" @keyword
"pure" @keyword
"payable" @keyword
"nonpayable" @keyword


;; --------------------------
;; Interface
;; --------------------------
(interface_function name: (identifier) @function)
(interface_event name: (identifier) @function)
(interface_primitives) @type
(interface_extensions) @keyword

;; Parameter modifiers (handled as identifiers now)

;; --------------------------
;; Error Definitions
;; --------------------------
(error_definition name: (identifier) @error)

;; --------------------------
;; Control / Imports
;; --------------------------
(control_import) @keyword

;; --------------------------
;; Numbers
;; --------------------------
(number_decimal) @number
(number_hex) @number

;; --------------------------
;; Opcodes
;; --------------------------
(opcodes_io) @function.builtin

(opcodes_calculation) @operator
(opcodes_stop) @constant.builtin
(opcodes_stack) @variable.builtin

(template_parameter_call) @type.parameter

;; --------------------------
;; Macro Calls
;; --------------------------
(macro_call name: (identifier) @function.call)


;; --------------------------
;; Constants
;; --------------------------
(constant_definition name: (identifier) @constant)
(constant_reference) @constant

;; --------------------------
;; Jump Labels
;; --------------------------
(jump_label name: (identifier) @label)

;; --------------------------
;; Identifiers
;; --------------------------
(identifier) @variable

;; --------------------------
;; New Declarations
;; --------------------------
(declaration_table name: (identifier) @constant)
(declaration_test name: (identifier) @function.test)

;; --------------------------
;; Jumptables
;; --------------------------
(declaration_jumptable name: (identifier) @constant)
(jumptable_body (identifier) @label)

;; --------------------------
;; Builtin Functions
;; --------------------------
(builtin_function) @function.builtin
"__ERROR" @function.builtin
"__EVENT_HASH" @function.builtin
"__FUNC_SIG" @function.builtin
"__RIGHTPAD" @function.builtin
"__codesize" @function.builtin
"__tablesize" @function.builtin
"__tablestart" @function.builtin

;; --------------------------
;; Control/Include
;; --------------------------
(control_include) @keyword.import

;; --------------------------
;; Decorators
;; --------------------------
(decorator) @attribute
(decorator_item name: (identifier) @attribute)

;; --------------------------
;; String Literals
;; --------------------------
(string_literal) @string

;; --------------------------
;; Parameter Modifiers
;; --------------------------
(modifier_indexed) @keyword

;; --------------------------
;; Punctuation
;; --------------------------
"(" @punctuation.bracket
")" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
":" @punctuation.delimiter
"," @punctuation.delimiter
"#[" @punctuation.bracket
"]" @punctuation.bracket

