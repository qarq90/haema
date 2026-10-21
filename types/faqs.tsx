export type FAQ = {
    question: string;
    answer: React.ReactNode;
};

export type FAQSection = {
    id: string;
    number: string;
    title: string;
    faqs: FAQ[];
};