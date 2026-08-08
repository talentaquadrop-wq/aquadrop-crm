function StatCard({ icon, iconColor, title, value }) {
  return (
    <div className="stat-card">

      <div className="card-top">
        <div
          className="card-icon"
          style={{ background: iconColor }}
        >
          {icon}
        </div>

        <h3>{title}</h3>
      </div>

      <h1>{value}</h1>

    </div>
  );
}

export default StatCard;