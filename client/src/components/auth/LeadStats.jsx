import "./LeadStats.css";

export default function LeadStats({ leads }) {

  const total = leads.length;

  const newLeads = leads.filter(
    (l) => l.status === "New"
  ).length;

  const followups = leads.filter(
    (l) => l.followUpDate
  ).length;

  const won = leads.filter(
    (l) => l.status === "Won"
  ).length;

  return (

<div className="stats-grid">

<div className="stat-card">
<h2>{total}</h2>
<p>Total Leads</p>
</div>

<div className="stat-card">
<h2>{newLeads}</h2>
<p>New Leads</p>
</div>

<div className="stat-card">
<h2>{followups}</h2>
<p>Today's Followups</p>
</div>

<div className="stat-card">
<h2>{won}</h2>
<p>Won Leads</p>
</div>

</div>

  );
}