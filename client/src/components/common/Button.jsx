function Button({
  text,
  type = "button",
  onClick,
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "12px",
        background: "#0d6efd",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {text}
    </button>
  );
}

export default Button;