import "./LeadForm.css";

export default function LeadForm({
  formData,
  handleChange,
  handleSubmit,
  isEditing,
  setShowForm,
}) {

  return (

<div className="lead-form-card">

<div className="form-header">

<h2>
{isEditing ? "Edit Lead" : "Add New Lead"}
</h2>

<button
className="close-btn"
onClick={()=>setShowForm(false)}
>
✕
</button>

</div>

<form onSubmit={handleSubmit}>

<div className="form-grid">

<div className="form-group">
<label>Customer Name</label>
<input
type="text"
name="name"
value={formData.name}
onChange={handleChange}
required
/>
</div>

<div className="form-group">
<label>Phone Number</label>
<input
type="text"
name="phone"
value={formData.phone}
onChange={handleChange}
required
/>
</div>

<div className="form-group">
<label>Email</label>
<input
type="email"
name="email"
value={formData.email}
onChange={handleChange}
/>
</div>

<div className="form-group">
<label>City</label>
<input
type="text"
name="city"
value={formData.city}
onChange={handleChange}
/>
</div>

<div className="form-group">
<label>Address</label>
<input
type="text"
name="address"
value={formData.address}
onChange={handleChange}
/>
</div>

<div className="form-group">
<label>Water TDS</label>
<input
type="number"
name="tds"
value={formData.tds}
onChange={handleChange}
/>
</div>

<div className="form-group">
<label>Product</label>
<input
type="text"
name="product"
value={formData.product}
onChange={handleChange}
/>
</div>

<div className="form-group">
<label>Status</label>

<select
name="status"
value={formData.status}
onChange={handleChange}
>

<option>New</option>
<option>Contacted</option>
<option>Qualified</option>
<option>Won</option>
<option>Lost</option>

</select>

</div>

<div className="form-group">

<label>Priority</label>

<select
name="priority"
value={formData.priority}
onChange={handleChange}
>

<option>High</option>
<option>Medium</option>
<option>Low</option>

</select>

</div>

<div className="form-group">

<label>Assigned To</label>

<input
type="text"
name="assignedTo"
value={formData.assignedTo}
onChange={handleChange}
/>

</div>

<div className="form-group">

<label>Follow Up</label>

<input
type="date"
name="followUpDate"
value={formData.followUpDate}
onChange={handleChange}
/>

</div>

</div>

<div className="form-group">

<label>Remarks</label>

<textarea
rows="4"
name="remarks"
value={formData.remarks}
onChange={handleChange}
/>

</div>

<div className="form-buttons">

<button
type="submit"
className="save-btn"
>

{isEditing ? "Update Lead" : "Save Lead"}

</button>

<button
type="button"
className="cancel-btn"
onClick={()=>setShowForm(false)}
>

Cancel

</button>

</div>

</form>

</div>

  );

}