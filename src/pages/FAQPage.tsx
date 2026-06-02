import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';

const SUPPORT_WHATSAPP = import.meta.env.VITE_SUPPORT_WHATSAPP || '+233000000000';

const faqs = [
  {
    category: 'Buying Data',
    questions: [
      {
        q: 'How do I buy data bundles on NetGH?',
        a: 'Select your network (MTN, AirtelTigo or Telecel), choose a data package, enter the recipient number, enter your MoMo payment number, and approve the payment prompt. Data is delivered instantly.',
      },
      {
        q: 'What is the cheapest data bundle available?',
        a: 'Data bundles start from as low as GHS 4.20 for AirtelTigo and GHS 4.90 for MTN. Visit NetGH to see the latest prices.',
      },
      {
        q: 'How long does data delivery take?',
        a: 'Data is delivered to the recipient number within 1–5 minutes after your MoMo payment is confirmed.',
      },
      {
        q: 'Can I send data to another person\'s number?',
        a: 'Yes! During checkout, enter the number you want to receive the data in the "Recipient Number" field, and your own MoMo number in the "Payment Number" field.',
      },
    ],
  },
  {
    category: 'Payments',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all Ghana Mobile Money networks: MTN MoMo, AirtelTigo Money, and Telecel Cash (Vodafone Cash).',
      },
      {
        q: 'Is my payment secure?',
        a: 'Yes. All payments are processed securely through Moolre, a trusted Ghana payment gateway. We never store your MoMo PIN.',
      },
      {
        q: 'What if I was charged but didn\'t receive data?',
        a: 'Contact us immediately via WhatsApp with your order number. We will investigate and resolve within 30 minutes.',
      },
      {
        q: 'Can I get a refund?',
        a: 'If data delivery fails after successful payment, we will refund your MoMo wallet within 24 hours.',
      },
    ],
  },
  {
    category: 'Result Checkers',
    questions: [
      {
        q: 'How do I buy a WASSCE or BECE result checker?',
        a: 'Select the WASSCE or BECE checker on NetGH, pay via mobile money, and receive your PIN and serial number instantly via SMS.',
      },
      {
        q: 'How do I use the checker PIN?',
        a: 'Visit the official WAEC results website (ghana.waecdirect.org for WASSCE or waecgh.org for BECE), enter your index number, and use the PIN and serial you received.',
      },
      {
        q: 'Can the PIN be used more than once?',
        a: 'No. Each checker PIN is for single use only. Please keep it safe.',
      },
    ],
  },
  {
    category: 'Orders & Support',
    questions: [
      {
        q: 'How do I track my order?',
        a: 'Visit the "Track Order" page and enter your order number (sent to you after checkout). You can also check the status at any time.',
      },
      {
        q: 'What are your support hours?',
        a: 'Our support team is available 24/7 via WhatsApp. We typically respond within 5 minutes.',
      },
    ],
  },
];

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-sky-100 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-sky-50 transition-colors"
      >
        <span className="font-medium text-gray-900 text-sm pr-4">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 text-sm text-gray-500 border-t border-sky-50 pt-3">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQPage = () => {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <div className="w-14 h-14 mx-auto mb-4 gradient-brand rounded-2xl flex items-center justify-center shadow-md">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
            <p className="text-gray-500 mt-2 text-sm">Everything you need to know about NetGH</p>
          </div>

          <div className="space-y-8">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="font-bold text-gray-900 mb-3 text-base">{section.category}</h2>
                <div className="space-y-2">
                  {section.questions.map((item) => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-10 bg-sky-50 rounded-2xl border border-sky-100 p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-2">Still have questions?</h3>
            <p className="text-sm text-gray-500 mb-4">Our support team is available 24/7 on WhatsApp</p>
            <a
              href={`https://wa.me/${SUPPORT_WHATSAPP.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default FAQPage;
