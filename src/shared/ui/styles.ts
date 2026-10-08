/**
 * Shared class recipes. A utility combination used in more than one place
 * belongs here (or becomes a component), never copied inline.
 */
export const styles = {
  layout: {
    container: "max-w-6xl mx-auto px-4 sm:px-6",
    headerBar: "max-w-6xl mx-auto px-4 sm:px-6 min-h-14 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1",
    navRow: "flex flex-wrap gap-1 justify-end",
    pageStack: "space-y-10",
    homeStack: "space-y-14",
  },
  text: {
    muted: "text-muted",
    small: "text-sm text-muted",
    tiny: "text-xs text-muted",
    code: "font-mono text-xs text-accent",
    h1: "text-2xl font-bold",
    h2: "text-xl font-semibold",
    h3: "font-semibold",
    hero: "text-3xl sm:text-5xl font-bold tracking-tight",
  },
  link: {
    subtle: "hover:text-accent",
    nav: "px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md whitespace-nowrap text-xs sm:text-sm",
    navActive: "bg-accent/15 text-accent",
    navIdle: "text-muted hover:text-foreground",
  },
  surface: {
    card: "rounded-lg border border-border bg-card",
    cardPadded: "rounded-lg border border-border bg-card p-4",
    list: "divide-y divide-border rounded-lg border border-border bg-card",
    listRow: "flex gap-3 px-4 py-3 hover:bg-accent/5",
    dropdown: "absolute z-10 mt-1 w-full rounded-md border border-border bg-card shadow-lg overflow-hidden",
    dropdownRow: "block px-3 py-2 text-sm hover:bg-accent/10",
    sticky: "sticky top-20 max-h-[80vh] overflow-y-auto",
  },
  control: {
    input: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent",
    checkbox: "mt-1 size-4 accent-blue-600",
    chipRow: "flex flex-wrap gap-2",
    buttonRow: "flex gap-2",
    ctaRow: "flex flex-wrap gap-3",
  },
  grid: {
    two: "grid gap-3 sm:grid-cols-2",
    three: "grid gap-4 sm:grid-cols-3",
    responsive3: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
    docLayout: "lg:grid lg:grid-cols-[1fr_240px] lg:gap-10",
  },
  chat: {
    log: "space-y-3 max-h-[60vh] overflow-y-auto pr-1",
    logCompact: "space-y-3 max-h-[40vh] overflow-y-auto pr-1",
    user: "ml-auto max-w-[85%] rounded-xl bg-accent text-white px-3 py-2 text-sm whitespace-pre-wrap break-words",
    bot: "mr-auto max-w-[85%] rounded-xl border border-border bg-card px-3 py-2 text-sm whitespace-pre-wrap break-words",
    textarea: "w-full min-w-0 rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent min-h-20 resize-y",
    select: "w-full max-w-full min-w-0 truncate rounded-md border border-border bg-card px-2 py-1.5 text-sm",
    optionRow: "flex flex-col gap-1 text-sm w-full min-w-0",
  },
  bubble: {
    button: "fixed bottom-4 right-4 z-30 rounded-full bg-accent text-white shadow-lg px-4 py-3 text-sm font-medium active:scale-95 transition",
    panel: "fixed z-30 inset-x-0 bottom-0 w-full sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-[400px] max-w-full box-border max-h-[85dvh] overflow-y-auto overflow-x-hidden rounded-t-2xl sm:rounded-2xl border border-border bg-background shadow-2xl p-4",
    panelHeader: "flex items-center justify-between gap-2 mb-1",
  },
  hero3d: {
    wrap: "relative overflow-hidden rounded-2xl border border-border bg-card",
    canvas: "absolute inset-0 pointer-events-none opacity-35 sm:opacity-70 dark:opacity-50 sm:dark:opacity-80",
    content: "relative z-10 p-6 sm:p-10",
  },
  illustration: {
    header: "flex items-start justify-between gap-4",
    img: "hidden sm:block w-36 shrink-0 select-none",
  },
  pager: "mt-10 flex justify-between gap-4 text-sm border-t border-border pt-4",
  flashcard: "min-h-44 p-6 flex flex-col justify-center shadow-sm active:scale-[0.99] transition",
  prose: "doc prose prose-neutral dark:prose-invert mt-4 prose-headings:tracking-tight prose-a:text-accent prose-code:before:content-none prose-code:after:content-none",
  state: {
    done: "line-through text-muted",
    activeOutline: "border-accent text-accent",
  },
} as const;
