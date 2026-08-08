import "./LeadFilters.css";

export default function LeadFilters({
  search,
  setSearch,
  activeStatus,
  setActiveStatus,
  setShowForm,
}) {

  const filters = [
    "All",
    "New",
    "Contacted",
    "Qualified",
    "Won",
    "Lost",
  ];

  return (
    <div className="lead-toolbar">

      <div className="toolbar-left">

        <input
          type="text"
          placeholder="🔍 Search by Name, Phone, Email..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

      </div>

      <button
        className="add-lead-btn"
        onClick={()=>setShowForm(true)}
      >
        + Add Lead
      </button>

      <div className="filter-row">

        {filters.map((item)=>(
          <button
            key={item}
            className={
              activeStatus===item
                ? "active-filter"
                : ""
            }
            onClick={()=>setActiveStatus(item)}
          >
            {item}
          </button>
        ))}

      </div>

    </div>
  );
}