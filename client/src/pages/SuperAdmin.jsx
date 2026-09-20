import React, { useEffect, useState } from "react";
import axios from "axios";

const SuperAdmin = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/superadmin");
        setAdmin(res.data);
      } catch (err) {
        console.log("Error fetching admin", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  if (loading) return <h2>Loading Super Admin...</h2>;

  return (
    <div style={{ margin: "20px", padding: "20px", border: "1px solid #ccc", width: "400px" }}>
      <h2>Super Admin Details</h2>

      {admin ? (
        <div>
          <p><strong>Name:</strong> {admin.name}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Role:</strong> {admin.role}</p>
        </div>
      ) : (
        <p>No Super Admin Found.</p>
      )}
    </div>
  );
};

export default SuperAdmin;
