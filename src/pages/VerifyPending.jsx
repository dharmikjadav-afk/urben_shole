import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function VerifyPending() {
  const location = useLocation();
  const email = location.state?.email || "your email";

  const [time, setTime] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Verify Your Email</h2>
      <p>
        A verification link has been sent to <b>{email}</b>
      </p>
      <p>Please check your inbox and verify your account.</p>
      <p>You can login after verification.</p>

      <p style={{ marginTop: "20px" }}>
        Link expires in: <b>{time}s</b>
      </p>
    </div>
  );
}

export default VerifyPending;