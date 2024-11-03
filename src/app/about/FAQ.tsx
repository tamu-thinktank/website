import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Container from "../../components/Container";

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
        <AccordionItem value="question-1">
          <AccordionTrigger>Question1?</AccordionTrigger>
          <AccordionContent>
            Ah yes, this is the answer to question 1.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="question-2">
          <AccordionTrigger>Question2?</AccordionTrigger>
          <AccordionContent>
            Indubitably, this is the answer to question 2.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="question-3">
          <AccordionTrigger>Question3?</AccordionTrigger>
          <AccordionContent>
            Nah, this is the answer to question 3.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="question-4">
          <AccordionTrigger>Question4?</AccordionTrigger>
          <AccordionContent>
            Yeah, this is the answer to question 4.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Container>
  );
}

export default FAQ;
