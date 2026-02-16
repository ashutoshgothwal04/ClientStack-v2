import { useAuth } from "context/AuthContext";
import toast from "react-hot-toast";

const ProtectedAction = ({ children, onAction, openModal }) => {
  const { session, setPendingAction } = useAuth();

  const handleClick = () => {
    if (!session) {
      setPendingAction(() => onAction);
      openModal();
      toast("Please login to continue");
      return;
    }

    onAction();
  };

  return (
    <div onClick={handleClick} className="inline-block">
      {children}
    </div>
  );
};

export default ProtectedAction;
