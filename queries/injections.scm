;; ==========================
;; Huff Injections
;; ==========================

;; Currently minimal - only basic natspec and comment injections
;; based on the current grammar's available node types

;; --------------------------
;; Natspec documentation
;; --------------------------
((natspec) @injection.content
  (#set! injection.language "markdown"))

((comment_block) @injection.content
  (#match? @injection.content "^/\\*\\*")
  (#set! injection.language "markdown"))
