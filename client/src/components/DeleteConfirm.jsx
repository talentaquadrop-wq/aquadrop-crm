import React from "react";
import "./DeleteConfirm.css";

export default function DeleteConfirm({
  open,
  onCancel,
  onDelete,
}) {

  if(!open) return null;

  return(

<div className="confirm-overlay">

<div className="confirm-box">

<h2>Delete Lead?</h2>

<p>
This action cannot be undone.
</p>

<div className="confirm-buttons">

<button
className="cancel"
onClick={onCancel}
>
Cancel
</button>

<button
className="delete"
onClick={onDelete}
>
Delete
</button>

</div>

</div>

</div>

  );

}