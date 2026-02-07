import { useState } from "react";
import Icon from "../../../components/AppIcon";

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left font-medium"
      >
        {question}
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={18} />
      </button>

      {open && (
        <p className="mt-2 text-sm text-muted-foreground">{answer}</p>
      )}
    </div>
  );
};

export default FAQItem;
