import { useNavigate, useLocation } from "react-router-dom";

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 text-center">
        <h2 className="text-lg font-semibold">
          ⚠️ Please login to continue
        </h2>

        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={() =>
              navigate("/login", {
                state: { from: location.pathname },
              })
            }
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            Login
          </button>

          <button
            onClick={() =>
              navigate("/register", {
                state: { from: location.pathname },
              })
            }
            className="px-4 py-2 border rounded-md"
          >
            Register
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
