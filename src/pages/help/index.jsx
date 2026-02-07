import { useState } from "react";

import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import Breadcrumb from "../../components/ui/Breadcrumb";

import HelpCard from "./components/HelpCard";
import FAQItem from "./components/FAQItem";
import ContactSupport from "./components/ContactSupport";
import FeedbackModal from "./components/FeedbackModal";

const Help = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [faqSearch, setFaqSearch] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const faqs = [
    {
      question: "How do I add a new client?",
      answer: "Go to the Clients page and click on the 'Add Client' button.",
    },
    {
      question: "Can I generate invoices automatically?",
      answer: "Yes, invoices can be generated manually or via AI assistance.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we use industry-standard security practices and encryption.",
    },
    {
      question: "Can clients access their own dashboard?",
      answer:
        "Yes, clients can log in and view projects, invoices, and contracts.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />

      <Header
        sidebarExpanded={sidebarExpanded}
        onMenuToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />

      <main className="lg:ml-60 pt-16">
        <div className="p-6">
          <Breadcrumb
            customItems={[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Help", isLast: true },
            ]}
          />

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Help & Support</h1>
            <p className="text-muted-foreground">
              Find answers, guides, and support resources
            </p>
          </div>

          {/* Help Cards */}
          <div className="mb-10 grid gap-6 md:grid-cols-3">
            <HelpCard
              icon="Users"
              title="Managing Clients"
              description="Learn how to add, edit, and manage your clients."
            />
            <HelpCard
              icon="FileText"
              title="Invoices & Billing"
              description="Create, manage, and track invoices and payments."
            />
            <HelpCard
              icon="Settings"
              title="Account Settings"
              description="Update your profile, business info, and preferences."
            />
          </div>

          {/* FAQ Section */}
          <div className="mb-10 max-w-3xl">
            <h2 className="mb-4 text-xl font-semibold">
              Frequently Asked Questions
            </h2>

            {/* FAQ Search */}
            <input
              type="text"
              placeholder="Search questions..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="mb-4 w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No matching questions found.
              </p>
            )}
          </div>

          {/* Contact Support */}
          <ContactSupport onFeedbackClick={() => setShowFeedback(true)} />
        </div>
      </main>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </div>
  );
};

export default Help;
