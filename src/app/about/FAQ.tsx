import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Container from "../../components/Container";

const faqData = [
  {
    question: "What Do Design Challenges Look Like?",
    answer: "Ah yes, this is the answer to question 1."
  },
  {
    question: "What is the Expected Time Commitment?",
    answer: "Indubitably, this is the answer to question 2."
  },
  {
    question: "What Do We Value in Applicants?",
    answer: "Of course, this is the answer to question 3."
  },
  {
    question: "What is the Typical Team Structure?",
    answer: "Yeah, this is the answer to question 4."
  },
  {
    question: "What is the Role of Peer and Faculty Mentors?",
    answer: "Indeed, this is the answer to question 5."
  }
];

function FAQ() {
  return (
    <Container>
      <div className="space-y-4 px-6 md:px-0">
        <h2 className="text-left text-3xl font-semibold italic text-gray-800 dark:text-white md:text-4xl">
          Frequently Asked Questions
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
    </Container>
  );
}

export default FAQ;
