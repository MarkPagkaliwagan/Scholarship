"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Who is eligible to apply for the San Pablo City Scholarship?",
    answer: "Bona fide residents of San Pablo City who are currently enrolled or planning to enroll in a recognized college or university, with a general weighted average (GWA) of at least 85% or its equivalent."
  },
  {
    question: "What are the required documents for application?",
    answer: "You will need a Certificate of Residency, a certified true copy of your latest grades, a Certificate of Indigency (if applicable), and a valid ID. Additional documents may be requested based on the specific scholarship tier."
  },
  {
    question: "How long does the evaluation process take?",
    answer: "The initial evaluation typically takes 2-3 weeks after the application deadline. You can track your status anytime using your Application ID in the tracking tool above."
  },
  {
    question: "Can I apply if I already have another scholarship?",
    answer: "Generally, students enjoying other major government or private scholarships are not eligible, to allow more students to benefit from the program. However, partial subsidies may be considered case-by-case."
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index}
            className="rounded-2xl transition-all duration-200 overflow-hidden"
            style={{ 
              background: isOpen ? "var(--cream)" : "var(--parchment)",
              border: "1px solid",
              borderColor: isOpen ? "var(--green-bright)" : "var(--sand)"
            }}
          >
            <button
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              style={{ color: "var(--green-deep)" }}
            >
              <span className="font-display font-medium text-lg pr-8">{faq.question}</span>
              <ChevronDown 
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                style={{ color: isOpen ? "var(--green-bright)" : "var(--muted)" }}
              />
            </button>
            
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-48 pb-5 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <p className="font-body text-base leading-relaxed" style={{ color: "var(--muted)" }}>
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
