export default function Home() {
	return (
		<div className="space-y-6 rounded-xl border border-border bg-background p-6 text-foreground">
  <h1 className="text-2xl font-bold">Theme System Test</h1>

  <p className="font-sans text-xl">Oxanium works</p>
<code className="font-mono">Source Code Pro works</code>


  <p className="text-muted-foreground">
    This paragraph uses <code>text-muted-foreground</code>. It should look softer than the main text.
  </p>

  <p>
    This is normal foreground text. Your background is
    <span className="mx-1 rounded bg-muted px-2 py-0.5 text-muted-foreground">
      bg-background
    </span>
    and this text uses <code>text-foreground</code>.
  </p>

  <div className="rounded-lg bg-card p-4 text-card-foreground shadow">
    <p className="font-semibold">Card Container</p>
    <p className="text-sm text-muted-foreground">
      This box uses <code>bg-card</code> and <code>text-card-foreground</code>.
    </p>
  </div>

  <div className="flex gap-3">
    <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
      Primary Action
    </button>

    <button className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground">
      Secondary Action
    </button>

    <button className="rounded-md bg-accent px-4 py-2 text-accent-foreground">
      Accent Action
    </button>
  </div>

  <div className="rounded-lg border border-border bg-muted p-4">
    <p className="font-medium">Muted Panel</p>
    <p className="text-muted-foreground">
      This is used for subtle UI like side panels, empty states, etc.
    </p>
  </div>

  <div className="rounded-lg border border-destructive bg-destructive p-4 text-destructive-foreground">
    <p className="font-semibold">Destructive State</p>
    <p>
      This should feel like a warning or irreversible action.
    </p>
  </div>

  <div className="rounded-lg border border-sidebar-border bg-sidebar p-4 text-sidebar-foreground">
    <p className="font-semibold">Sidebar Preview</p>
    <p className="text-sm">
      This block is using your sidebar tokens.
    </p>
  </div>
</div>

	)
}