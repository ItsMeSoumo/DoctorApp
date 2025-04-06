import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form Submitted!");
  };

  return (
    <div
      style={{
        maxWidth: "350px",
        margin: "15px auto",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Contact Form</h3>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "6px",
            marginBottom: "8px",
            border: "1px solid #ccc",
            borderRadius: "3px",
          }}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "6px",
            marginBottom: "8px",
            border: "1px solid #ccc",
            borderRadius: "3px",
          }}
        />

        <label>Phone No:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "6px",
            marginBottom: "8px",
            border: "1px solid #ccc",
            borderRadius: "3px",
          }}
        />

        <label>Message:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="3"
          required
          style={{
            width: "100%",
            padding: "6px",
            marginBottom: "8px",
            border: "1px solid #ccc",
            borderRadius: "3px",
            resize: "none",
          }}
        ></textarea>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "8px",
            background: "blue",
            color: "white",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Contact;
