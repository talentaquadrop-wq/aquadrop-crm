import "./LeadPopup.css";

export default function LeadPopup({
  lead,
  onClose,
}) {

  if (!lead) return null;

  return (

<div className="popup-overlay">

<div className="popup-card">

<div className="popup-header">

<h2>Lead Details</h2>

<button
className="close-popup"
onClick={onClose}
>

✕

</button>

</div>

<div className="popup-grid">

<div>
<strong>Name</strong>
<p>{lead.name}</p>
</div>

<div>
<strong>Phone</strong>
<p>{lead.phone}</p>
</div>

<div>
<strong>Email</strong>
<p>{lead.email || "-"}</p>
</div>

<div>
<strong>City</strong>
<p>{lead.city || "-"}</p>
</div>

<div>
<strong>Address</strong>
<p>{lead.address || "-"}</p>
</div>

<div>
<strong>Product</strong>
<p>{lead.product || "-"}</p>
</div>

<div>
<strong>Status</strong>
<p>{lead.status}</p>
</div>

<div>
<strong>Priority</strong>
<p>{lead.priority}</p>
</div>

<div>
<strong>Assigned To</strong>
<p>{lead.assignedTo || "-"}</p>
</div>

<div>
<strong>Water TDS</strong>
<p>{lead.tds || "-"}</p>
</div>

<div>
<strong>Follow Up</strong>
<p>{lead.followUpDate || "-"}</p>
</div>

<div>
<strong>Remarks</strong>
<p>{lead.remarks || "-"}</p>
</div>

</div>

<div className="popup-footer">

<button
className="close-btn-popup"
onClick={onClose}
>

Close

</button>

</div>

</div>

</div>

  );

}