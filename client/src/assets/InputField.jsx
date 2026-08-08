function InputField({
  type,
  placeholder,
  name,
  value,
  onChange,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "16px",
      }}
    />
  );
}

export default InputField;