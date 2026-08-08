import React from "react";
import "./LeadDetails.css";
import {
  Phone,
  MapPin,
  User,
  Package,
  BadgeCheck,
  X,
} from "lucide-react";

export default function LeadDetails({ lead, onClose }) {
  if (!lead) return null;

  return (
    <div className="drawer-overlay">
      <div className="drawer">

        <div className="drawer-header">
          <h2>Lead Details</h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">

          <div className="info-row">
            <User size={18}/>
            <span>{lead.name}</span>
          </div>

          <div className="info-row">
            <Phone size={18}/>
            <span>{lead.phone}</span>
          </div>

          <div className="info-row">
            <MapPin size={18}/>
            <span>{lead.city}</span>
          </div>

          <div className="info-row">
            <Package size={18}/>
            <span>{lead.product}</span>
          </div>

          <div className="info-row">
            <BadgeCheck size={18}/>
            <span>{lead.status}</span>
          </div>

        </div>

      </div>
    </div>
  );
}