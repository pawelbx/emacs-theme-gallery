(defun copyUrgentNotes()
  "Creates urgent notes in current buffer and adds them to kill ring"
  (interactive)
  (save-excursion
    (save-restriction
      (save-match-data
	(widen)
	(goto-char (point-min))
	(let ((urgentNotes "")))))))
