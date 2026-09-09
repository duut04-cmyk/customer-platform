/**
 * DEV ONLY — Design system visual test page.
 * Remove before production launch.
 */
"use client";

import { useState } from "react";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Logo from "@/common/components/Logo";
import Modal from "@/common/components/Modal";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-subheading font-medium">{title}</h2>
      {children}
    </section>
  );
}

function ColorSwatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-10 w-10 rounded-md border border-border ${className}`} />
      <span className="text-small text-muted-foreground">{name}</span>
    </div>
  );
}

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container-content space-y-16">
        <div className="space-y-2">
          <p className="text-caption font-medium uppercase tracking-wider text-muted-foreground">
            Development only
          </p>
          <h1 className="text-heading font-semibold">Doot Design System</h1>
        </div>

        <Section title="Logo">
          <div className="flex flex-wrap items-end gap-8">
            <Logo />
            <Logo className="text-heading" />
            <Logo className="text-heading-lg" />
          </div>
        </Section>

        <Section title="Typography">
          <div className="space-y-4">
            <p className="text-display font-semibold">Display</p>
            <p className="text-heading-lg font-semibold">Large heading</p>
            <p className="text-heading-md font-semibold">Section heading</p>
            <p className="text-heading font-semibold">Page heading</p>
            <p className="text-subheading font-medium">Subheading</p>
            <p className="text-body-lg">Body large — comfortable reading size.</p>
            <p className="text-body">Body — default paragraph text.</p>
            <p className="text-small text-muted-foreground">
              Small — secondary information.
            </p>
            <p className="text-caption text-muted-foreground">
              Caption — labels and metadata.
            </p>
          </div>
        </Section>

        <Section title="Colors">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <ColorSwatch name="background" className="bg-background" />
            <ColorSwatch name="foreground" className="bg-foreground" />
            <ColorSwatch name="surface" className="bg-surface" />
            <ColorSwatch name="accent (saffron)" className="bg-accent" />
            <ColorSwatch name="border" className="bg-border" />
            <ColorSwatch name="muted-foreground" className="bg-muted-foreground" />
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </Section>

        <Section title="Inputs">
          <div className="grid max-w-md gap-4">
            <Input placeholder="Default input" />
            <Input placeholder="Disabled input" disabled />
            <Input placeholder="Error-ready input" error />
          </div>
        </Section>

        <Section title="Modal">
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Open modal
          </Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Modal preview"
          >
            <p className="text-body text-muted-foreground">
              This modal establishes the foundation for authentication flows.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setModalOpen(false)}>
                Continue
              </Button>
            </div>
          </Modal>
        </Section>
      </div>
    </div>
  );
}
