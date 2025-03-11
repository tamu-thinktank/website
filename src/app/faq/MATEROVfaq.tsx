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
          Recurring Challenge teams are meant for prior ThinkTank members who have already completed their first Design Challenge, 
          but this year will allow for students to apply who just have general engineering experience beforehand. 
          Therefore, the MATE ROV team is looking for curious and motivated engineers to kick off the competition this year!
        </p>
      </>
    ),
  },
  {
    question: "What time commitment is expected?",
    answer: (
      <>
        <p className="mb-4">
          The time commitment will be equivalent to adding about <strong>two classes worth of work</strong> to your schedule. 
          Weekly team meetings are held for <strong>two hours every Sunday</strong>, and work will need to be done during the week in order to accomplish the team's goals.
        </p>
      </>
    ),
  },
  {
    question: "How are teams structured?",
    answer: (
      <>
        <p className="mb-4">
          Each Recurring Challenge team will differ in the number of members and subteams needed, but the MATE ROV team will be split like this:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Subteams:</strong> As explained, subteams have been designated as seen fit for the needs of the Recurring Challenge and 
            will be composed of team members who work together to meet the needs of the competition. 
            Members are placed in subteams that they find interest and passion in, and focus on the needs of their subteam to contribute to the whole. 
            The subteams for MATE ROV are as follows:
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Communications & Data Handling</li>
              <li>Electrical & Power Systems</li>
              <li>Fluids</li>
              <li>Guidance, Navigation, & Control</li>
              <li>Thermal, Mechanisms, and Structures</li>
            </ul>
          </li>
          <li className="mt-2">
            <strong>Leads:</strong> Recurring Challenge team leads will also differ depending on the team, 
            but leads designated for MATE ROV will be a Project Manager and a Chief Systems Engineer. 
            Team leads are responsible for managing the project and team, and integrating disciplines to engineer a final product through robust systems engineering.
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "When & where does the competition take place?",
    answer: (
      <>
        <p className="mb-4">
          Final competitions vary annually in location and in competition specifics, so it cannot yet be said where the 2026 championships will take place. 
          Due to the structure of the MATE ROV competition, the EXPLORER Class (TAMU ThinkTank's first-year competition class) will compete in the World Championship. 
          The 2024-2025 MATE ROV World Championship occurred in Alpena, Michigan!
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