import "./LeadTable.css";

export default function LeadTable({
  leads,
  handleView,
  handleEdit,
  handleDelete,
  handleConvert,
  handleStatusChange,
  sendWhatsApp,
}) {

  return (
    <div className="table-card">
      <table className="lead-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>City</th>
            <th>Product</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assigned</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td colSpan="8" className="empty-row">
                No Leads Found
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>

                <td>{lead.phone}</td>

                <td>{lead.city || "-"}</td>

                <td>{lead.product || "-"}</td>

                <td>
                  <select
                    className={`status ${lead.status}`}
                    value={lead.status}
                    onChange={(e) =>
                      handleStatusChange &&
                      handleStatusChange(lead._id, e.target.value)
                    }
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Interested">Interested</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </td>

                <td>
                  <span className={`priority ${lead.priority}`}>
                    {lead.priority}
                  </span>
                </td>

                <td>{lead.assignedTo || "-"}</td>

                <td>
                  <div className="actions">
                    <button
                      className="view-btn"
                      onClick={() => handleView(lead)}
                    >
                      View
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(lead)}
                    >
                      Edit
                    </button>

                    {lead.status === "Won" && !lead.isConverted && (
                      <button
                        className="convert-btn"
                        onClick={() => handleConvert(lead)}
                      >
                        Convert
                      </button>
                    )}

                    {lead.isConverted && (
                      <span className="converted">Converted</span>
                    )}

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(lead._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
