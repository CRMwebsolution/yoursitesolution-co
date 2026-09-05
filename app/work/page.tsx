import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { publishedProjects } from "@/config/site";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "Selected website projects from Your Site Solution.",
  robots: publishedProjects.length ? undefined : { index: false, follow: true },
};

export default function WorkPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Selected work"
        title={<>Real projects. <em>No filler.</em></>}
        description="This page stays out of the main navigation until there is finished work worth showing under the Your Site Solution name."
      />
      <section className="section">
        <div className="shell empty-work">
          {publishedProjects.length ? (
            publishedProjects.map((project) => (
              <article key={project.name}>
                <p>{project.category}</p><h2>{project.name}</h2><p>{project.summary}</p>
              </article>
            ))
          ) : (
            <>
              <p className="eyebrow">Portfolio in progress</p>
              <h2>The work will be added when it is ready.</h2>
              <p>No made-up case studies and no borrowed projects. In the meantime, request a free homepage demo for your own business.</p>
              <Link className="button" href="/free-demo">Request a demo <ArrowRight aria-hidden="true" /></Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
