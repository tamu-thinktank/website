import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Container from "../../components/Container";
  
const faqData = [
   {
    question: "Who can join ThinkTank's MATE ROV team?",
    answer: (
      <>
        <p className="mb-4">
          MATE ROV teams are meant for ThinkTank's Design Challenge Alumni, but students with relevant qualifications and prior experience are encouraged to apply.
        </p>
      </>
    ),
  },
  {
    question: "What time commitment is expected?",
    answer: (
      <>
        <p className="mb-4">
          All MATE ROV members are expected to contribute <strong>at least 12 hours per week</strong> (equivalent to 3 classes).
        </p>
        <p className="mb-4">The schedule includes:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Weekly team work meetings every Sunday from <strong>10 am - 12 pm</strong></li>
          <li>Biweekly progress reports every Saturday from <strong>10 am - 11 am</strong></li>
        </ul>
      </>
    ),
  },
  {
    question: "How is the MATE ROV team structured?",
    answer: (
      <>
        <p className="mb-4">
          The team will be split into the following subteams with 2-3 members in each:
        </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Thermal, Mechanisms, and Structures</li>
            <li>Electrical and Power Systems</li>
            <li>Guidance, Navigation, & Control</li>
            <li>Computation and Communications</li>
            <li>Fluids and Propulsion</li>
          </ul>
        <p className="mt-4">
          Leading the team will be a Project Manager and a Chief Systems Engineer who will be responsible for ensuring the members and technical aspects respectively all function well.
        </p>
      </>
    ),
  },
  ];
  
  function MateRovFaq() {
    return (
      <Container>
        <div className="px-6 md:px-6">
          <h2 className="text-left text-3xl font-semibold italic text-gray-800 dark:text-white md:text-4xl pb-4">
            MATE ROV
          </h2>
          <hr className="border-t-2 border-gray-300 dark:border-gray-600" />
          <Accordion type="single" collapsible>
            {faqData.map((item, index) => (
              <AccordionItem key={index} value={`question-${index + 1}`} className="border-b border-gray-300 dark:border-gray-600">
                <AccordionTrigger className="w-full text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-200">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        <div style={{ padding: "40px" }}></div>
        </div>
      </Container>
);
}

export default MateRovFaq;