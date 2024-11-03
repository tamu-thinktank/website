import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Container from "../../components/Container";

const faqData = [
  {
    question: "Question1?",
    answer: "Ah yes, this is the answer to question 1.",
  },
  {
    question: "Question2?",
    answer: "Indubitably, this is the answer to question 2.",
  },
  { question: "Question3?", answer: "Nah, this is the answer to question 3." },
  { question: "Question4?", answer: "Yeah, this is the answer to question 4." },
];

function FAQ() {
  return (
    <Container>
      <div className="space-y-4 px-6 md:px-0">
        <h2 className="text-left text-3xl font-semibold italic text-gray-800 dark:text-white md:text-4xl">
          FAQ
        </h2>
        <hr className="border-t-2 border-gray-300 dark:border-gray-600" />
      </div>

      <Accordion type="single" collapsible>
        {faqData.map((item, index) => (
          <AccordionItem key={index} value={`question-${index + 1}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div style={{ padding: "70px" }}></div>
    </Container>
  );
}

export default FAQ;
