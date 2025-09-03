import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Container from "../../components/Container";

const faqData = [
  {
    question: "What does competing in design challenges look like?",
    answer: (
      <>
        <p className="mb-4">
          In each design challenge, teams work to develop and demonstrate the
          best solution to a real-world problem through a structured process.
          Here’s what the journey typically involves:
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong>Preliminary Research:</strong> Teams begin by researching
            the challenge’s topic in-depth to understand key concepts and set a
            strong foundation.
          </li>
          <li>
            <strong>Requirements and Goals:</strong> Teams define the
            challenge’s goals, needs, and criteria, creating both a roadmap to
            guide the design process as well as an overall system architecture.
          </li>
          <li>
            <strong>Team Coordination:</strong> Teams assign roles and
            responsibilities while setting up timelines, supported by peer and
            faculty mentors, to shape a realistic, comprehensive project plan.
          </li>
          <li>
            <strong>Subsystem Development:</strong> Each member deepens their
            expertise in a chosen subsystem by researching, performing trade
            studies, and collaborating with others. Weekly workshops offer
            guidance on industry standards and practices.
          </li>
          <li>
            <strong>Subsystem Integration:</strong> Team members integrate the
            subsystems, resolving conflicts and creating a cohesive, functional
            design.
          </li>
          <li>
            <strong>Supporting Materials:</strong> Teams create CAD models, risk
            assessments, and potentially prototypes along with other visual aids
            to demonstrate the design’s viability.
          </li>
          <li>
            <strong>Final Deliverables:</strong> Depending on the competition,
            teams present their solutions through reports, presentations, or
            prototype tests, aiming to demonstrate why their design stands out.
          </li>
        </ol>
        <p className="mt-4">
          Throughout the process, participants apply professional engineering
          practices to develop and defend their solutions. This experience not
          only challenges our members but also equips them with valuable
          real-world engineering skills.
        </p>
      </>
    ),
  },
  {
    question: "How are teams structured?",
    answer: (
      <>
        <p className="mb-4">
          All teams are split into team members and team leads.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Team Members:</strong> The role of team members is to
            develop the subsystems of the project through research and
            documentation while demonstrating their knowledge with models and
            prototypes. For teams with 8+ members, team members are often placed
            in subteams by team leads and focus on a particular set of
            subsystems based on their interests and prior knowledge.
          </li>

          <li>
            <strong>Team Leads:</strong> The role of team leads is to manage the
            project and integrate subsystems into a cohesive proposal or final
            product through industry-standard systems engineering practices. The
            number of team leads depends on the size of the team as follows:
            <ul className="mt-2 list-none space-y-1 pl-5">
              <li>
                <span className="font-medium">3 - 6 members</span>: 1 team lead
              </li>
              <li>
                <span className="font-medium">6 - 12 members</span>: 2 team
                leads
              </li>
              <li>
                <span className="font-medium">12+ members</span>: 3 team leads
              </li>
            </ul>
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "How much time commitment is expected?",
    answer: (
      <>
        <p className="mb-4">
          Team members typically spend <strong>8 to 12 hours per week </strong>{" "}
          working on their projects. This workload is equivalent to{" "}
          <strong>1 in-major engineering class</strong>. These numbers fluctuate
          depending on deadlines, exams, and other factors so expect to have
          some weeks requiring up to 20 hours to finish your tasks.
        </p>
        <p className="mb-4">The average week is broken down as follows:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>4 to 6 hours conducting independent / peer research</li>
          <li>1 to 2 hours talking with professors / mentors</li>
          <li>1 to 2 hours discussing in team meetings</li>
          <li>1 hour learning at workshops</li>
          <li>1 hour building prototypes / modeling subsystems</li>
        </ul>

        <p className="mb-4 mt-4">
          Team leads usually spend <strong>12 to 15 hours per week</strong>{" "}
          directing their teams and managing the project. This workload is
          equivalent to <strong>1.5 in-major engineering classes</strong>. The
          workload can on rare occasions approach 25 hours so be prepared to be
          flexible near deadlines.
        </p>

        <p className="mb-4">
          For team leads, the average week is broken down into:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>3 to 4 hours directing team meetings</li>
          <li>2 to 3 hours integrating research</li>
          <li>2 to 3 hours talking with professors / mentors</li>
          <li>2 hours planning / assigning tasks</li>
          <li>2 hours conducting independent / peer research</li>
          <li>1 hour learning at workshops</li>
        </ul>
      </>
    ),
  },
  {
    question: "Who are peer and faculty mentors?",
    answer: (
      <>
        <p className="mb-4">
          Each team is assigned both a peer mentor and a faculty mentor.
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Peer Mentors:</strong> ThinkTank alumni who guide teams by
            suggesting research directions, finding resources, solving
            conflicts, providing feedback, and aiding in many more ways.
            Typically, peer mentors have competed in the same competition as
            their team potentially multiple times so they understand the
            competition better than anyone else. If you have any questions, they
            should be the first person you contact.
          </li>

          <li>
            <strong>Faculty Mentors:</strong> Professors who have extensive
            knowledge relating to the competition’s topic as well as contacts
            with professionals with specialized backgrounds. Teams work with
            their faculty mentors to determine the best solutions, locate
            external resources, and ensure work adheres to standard industry
            practices.
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "What does ThinkTank teach?",
    answer: (
      <>
        <p className="mb-4">
          ThinkTank hosts weekly workshops specialized for high performance in
          engineering design challenge projects. These workshops focus on topics
          such as research, requirement creation, systems engineering, trade
          studies, and interpersonal cooperation. Several workshops are
          dedicated to improving the presentation skills of our members through
          both lectures and practice opportunities.
        </p>

        <p className="mb-4">
          We test teams on their application of these skills through semesterly
          presentations to the officers where the teams are judged and provided
          feedback that is incorporated into later workshops.
        </p>

        <p className="mb-4">
          Much of what’s taught is inspired by lectures given in senior capstone
          classes and the experiences of prior competitors to best prepare
          members for their challenge, future academic path, and beyond. All of
          the skills taught in ThinkTank’s workshops are also directly linked to
          what recruiters in industry look for in interns and recent grads.
        </p>

        <p className="mb-4">
          While the workshops are tailored to the current needs of the teams,
          they are open to everyone, including non-ThinkTank members. Email us
          if you have an idea for a potential workshop you would like to see.
        </p>
      </>
    ),
  },
  {
    question: "What do we value in applicants?",
    answer: (
      <>
        <p className="mb-4">
          ThinkTank’s core values are <strong>Growth</strong>,{" "}
          <strong>Passion</strong>, and <strong>Teamwork</strong>. We look for
          candidates who demonstrate these qualities everyday in their personal,
          professional, and academic lives.
        </p>

        <p className="mb-4">
          We are an organization of dedicated people who are committed to
          accomplishing the goals we set our minds to. We achieve our goals
          through methodical planning, collaboration, and strategic
          implementation. Everything we do is fueled by our inner curiosity and
          drive to be the change we want to see in the world.
        </p>

        <p className="mb-4">
          We recommend applicants show us how they exemplify this culture and
          the unique characteristics that they bring to their team.
        </p>
      </>
    ),
  },
];

function DCfaq() {
  return (
    <Container>
      <div className="px-6 md:px-6">
        <h2 className="pb-4 text-left text-3xl font-semibold italic text-gray-800 dark:text-white md:text-4xl">
          Design Challenges
        </h2>
        <hr className="border-t-2 border-gray-300 dark:border-gray-600" />
        <Accordion type="single" collapsible>
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              value={`question-${index + 1}`}
              className="border-b border-gray-300 dark:border-gray-600"
            >
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

export default DCfaq;
