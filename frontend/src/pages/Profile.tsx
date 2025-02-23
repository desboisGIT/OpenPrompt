import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth?.user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {auth.user.username}</p>
      <p>Email: {auth.user.email}</p>
      <button
        onClick={() => {
          auth.logout();
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
