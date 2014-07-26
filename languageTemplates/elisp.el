(defun eww-history-browse ()
  "Browse the history under point in eww."
  (interactive)
  (let ((history (get-text-property (line-beginning-position) 'eww-history)))
    (unless history
      (error "No history on the current line"))
    (quit-window)
    (eww-restore-history history)))

(defvar eww-history-mode-map
  (let ((map (make-sparse-keymap)))
    (suppress-keymap map)
    (define-key map "q" 'quit-window)
