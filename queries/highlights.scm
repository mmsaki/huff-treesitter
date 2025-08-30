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
(declaration_macro) @function.macro
(declaration_fn) @function
(declaration_jumptable) @constant
(declaration_jumptable_packed) @constant


;; --------------------------
;; Interface
;; --------------------------
(interface_function) @function
(interface_event) @function
(interface_primitives) @type
(interface_extensions) @keyword

;; --------------------------
;; Error Definitions
;; --------------------------
(error_definition) @error

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
(macro_call) @function.call


;; --------------------------
;; Constants
;; --------------------------
(constant_definition) @constant

(constant_reference) @constant

