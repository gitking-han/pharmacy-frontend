import React from "react";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-7">
      <h1 className="display-3 text-danger">404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Button color="primary" onClick={() => navigate("/admin/index")}>
        Go Back to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;
