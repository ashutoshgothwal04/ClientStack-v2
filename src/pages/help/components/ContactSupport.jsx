const ContactSupport = ({ onFeedbackClick }) => {
  return (
    <div className="mt-12 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Still need help?</h3>
      <p className="mb-4 text-muted-foreground">
        Reach out to our support team or send us feedback.
      </p>

      <div className="flex gap-3">
        <a
          href="mailto:support@yourapp.com"
          className="rounded-md bg-primary px-4 py-2 text-sm text-white"
        >
          Contact Support
        </a>

        <button
          onClick={onFeedbackClick}
          className="rounded-md border px-4 py-2 text-sm"
        >
          Send Feedback
        </button>
      </div>
    </div>
  );
};

export default ContactSupport;
