import { Icon, type IconName } from "../icons/Icon";

const projects: Array<{
  icon: IconName;
  scene: string;
  titleDe: string;
  titleEn: string;
  proof: string;
  outcome: string;
}> = [
  {
    icon: "handHeart",
    scene: "scene-kitchen",
    titleDe: "Nachbarschaftsküche",
    titleEn: "Community kitchen",
    proof: "2h Hilfe / 40 GDD_DEMO",
    outcome: "Schicht bestätigt / Shift reviewed",
  },
  {
    icon: "recycle",
    scene: "scene-repair",
    titleDe: "Reparaturtreff",
    titleEn: "Repair cafe",
    proof: "25 kg CO2e / 2.5 PLANEDO",
    outcome: "Impact mit Beleg / Impact with evidence",
  },
  {
    icon: "sprout",
    scene: "scene-climate",
    titleDe: "Lokaler Klimabeitrag",
    titleEn: "Local climate action",
    proof: "Aktion + Receipt",
    outcome: "Für Partner teilbar / Shareable with partners",
  },
];

export function ProjectExamples() {
  return (
    <section id="projects" className="project-examples" aria-labelledby="projects-heading">
      <div className="section-intro">
        <span className="step-label">Reale Projekte / Real projects</span>
        <h2 id="projects-heading">Was Menschen wirklich sehen wollen.</h2>
        <p>
          Kein Technikdiagramm zuerst. Eine Person, ein Beitrag, ein bestätigter
          Nachweis und eine Wallet-Ansicht, die im Projektalltag Sinn ergibt.
        </p>
        <p className="copy-en">
          Not a technical diagram first. A person, a contribution, a reviewed proof,
          and a wallet view people can understand.
        </p>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.titleEn}>
            <div className={`project-scene ${project.scene}`} aria-hidden="true">
              <span className="scene-sun" />
              <span className="scene-ground" />
              <span className="scene-main" />
              <span className="scene-side" />
              <span className="scene-proof">
                <Icon name={project.icon} size={18} />
              </span>
            </div>
            <div className="project-card-copy">
              <Icon name={project.icon} size={20} />
              <div>
                <strong>{project.titleDe}</strong>
                <span>{project.titleEn}</span>
              </div>
            </div>
            <dl>
              <div>
                <dt>Nachweis / Proof</dt>
                <dd>{project.proof}</dd>
              </div>
              <div>
                <dt>Ergebnis / Outcome</dt>
                <dd>{project.outcome}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
