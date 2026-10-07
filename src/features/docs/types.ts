export type Group = "A" | "B" | "C" | "D" | "E";

export type DocMeta = {
  slug: string;
  file: string;
  code: string;      // "A1", "B3"...
  group: Group;
  title: string;
  summary: string;
  readMinutes: number;
};

export type Heading = { id: string; text: string; depth: 2 | 3 };

export type Doc = {
  meta: DocMeta;
  html: string;
  headings: Heading[];
  prev: DocMeta | null;
  next: DocMeta | null;
};
