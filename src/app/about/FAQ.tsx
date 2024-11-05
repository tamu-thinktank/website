import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Container from "../../components/Container";

const faqData = [
  {
    question: "What Does Competing in Design Challenges Look Like?",
    answer: `In each design challenge, teams work to develop and demonstrate the best solution to a real-world problem through a structured process. Here’s what the journey typically involves:

    Preliminary Research: Teams begin by researching the challenge’s topic in-depth to understand key concepts and set a strong foundation.

    Requirements and Goals: Teams define the challenge’s goals, needs, and criteria, creating both a roadmap to guide the design process as well as an overall system architecture.

    Team Coordination: Teams assign roles and responsibilities while setting up timelines, supported by peer and faculty mentors, to shape a realistic, comprehensive project plan.

    Subsystem Development: Each member deepens their expertise in a chosen subsystem by researching, performing trade studies, and collaborating with others. Weekly workshops offer guidance on industry standards and practices.

    Subsystem Integration: Team members integrate the subsystems, resolving conflicts and creating a cohesive, functional design.

    Supporting Materials: Teams create CAD models, risk assessments, and potentially prototypes along with other visual aids to demonstrate the design’s viability.

    Final Deliverables: Depending on the competition, teams present their solutions through reports, presentations, or prototype tests, aiming to demonstrate why their design stands out.

    Throughout, participants apply professional engineering practices to develop and defend their solutions. This experience not only challenges our members but also equips them with valuable, real-world engineering skills.`,
  },
  {
    question: "How are Teams Structured?",
    answer: `All teams are split into team members and team leads.

    The role of team members is to develop the subsystems of the project through research and documentation while demonstrating their knowledge with models and prototypes. For teams with 8+ members, team members are often placed in subteams by team leads and focus on a particular set of subsystems based on their interests and prior knowledge.

    The role of team leads is to manage the project and integrate subsystems into a cohesive proposal / final product through industry-standard systems engineering practices. The number of team leads depends on the size of the team as follows:
    3 - 6 members   => 1 team lead
    6 - 12 members => 2 team leads
    12+ members    => 3 team leads`,
  },
  {
    question: "How Much Time Commitment is Expected?",
    answer: `Team members typically spend 8 to 12 hours per week working on their projects. This workload is equivalent to 1 in-major engineering class. These numbers fluctuate depending on deadlines, exams, and other factors so expect to have some weeks requiring up to 20 hours to finish your tasks.

    The average week is broken down as follows:
    4 to 6 hours conducting independent / peer research
    1 to 2 hours talking with professors / mentors
    1 to 2 hours discussing in team meetings
    1 hour learning at workshops
    1 hour building prototypes / modeling subsystems

    Team leads usually spend 12 to 15 hours per week directing their teams and managing the project. This workload is equivalent to 1.5 in-major engineering classes. The workload can on rare occasions approach 25 hours so be prepared to be flexible near deadlines.

    For team leads, the average week is broken down into:
    3 to 4 hours directing team meetings
    2 to 3 hours integrating research
    2 to 3 hours talking with professors / mentors
    2 hours planning / assigning tasks
    2 hours conducting independent / peer research
    1 hour learning at workshops`,
  },
  {
    question: "Who are Peer and Faculty Mentors?",
    answer: `Each team is assigned both a peer mentor and a faculty mentor.

    Peer mentors are ThinkTank alumni who guide teams by suggesting research directions, finding resources, solving conflicts, providing feedback, and aiding in many more ways. Typically, peer mentors have competed in the same competition as their team potentially multiple times so they understand the competition better than anyone else. If you have any questions, they should be the first person you contact.

    Faculty mentors are professors who have extensive knowledge relating to the competition’s topic as well as contacts with professionals with specialized backgrounds. Teams work with their faculty mentors to determine the best solutions, locate external resources, and ensure work adheres to standard industry practices.`,
  },
  {
    question: "What does ThinkTank Teach?",
    answer: `ThinkTank hosts weekly workshops specialized for high performance in engineering design challenge projects. These workshops focus on topics such as research, requirement creation, systems engineering, trade studies, and interpersonal cooperation. Several workshops are dedicated to improving the presentation skills of our members through both lectures and practice opportunities. We test teams on their application of these skills through semesterly presentations to the officers where the teams are judged and provided feedback that is incorporated into later workshops.

    Much of what’s taught is inspired by lectures given in senior capstone classes and the experiences of prior competitors to best prepare members for their challenge, future academic path, and beyond. All of the skills taught in ThinkTank’s workshops are also directly linked to what recruiters in industry look for in interns and recent grads.

    While the workshops are tailored to the current needs of the teams, they are open to everyone, including non-ThinkTank members. Email us if you have an idea for a potential workshop you would like to see.`,
  },
  {
    question: "What do We Value in Applicants?",
    answer: `ThinkTank’s core values are Growth, Passion, and Teamwork. We look for candidates who demonstrate these qualities everyday in their personal, professional, and academic lives. We are an organization of dedicated people who are committed to accomplishing the goals we set our minds to. We achieve our goals through methodical planning, collaboration, and strategic implementation. Everything we do is fueled by our inner curiosity and drive to be the change we want to see in the world. We recommend applicants show us how they exemplify this culture and the unique characteristics that they bring to their team.`,
  },
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
      <div style={{ padding: "40px" }}></div>
    </Container>
  );
}

export default FAQ;
