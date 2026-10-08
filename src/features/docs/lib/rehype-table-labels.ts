/**
 * Adds data-label="<header>" to every <td> so CSS can stack tables into cards on
 * narrow screens (see globals.css `.doc table` mobile rules).
 */
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Element, Root } from "hast";

export function rehypeTableLabels() {
  return (tree: Root) => {
    visit(tree, "element", (table: Element) => {
      if (table.tagName !== "table") return;
      const headers: string[] = [];
      visit(table, "element", (th: Element) => { if (th.tagName === "th") headers.push(toString(th).trim()); });
      if (headers.length === 0) return;
      visit(table, "element", (tr: Element) => {
        if (tr.tagName !== "tr") return;
        let i = 0;
        for (const cell of tr.children) {
          if (cell.type === "element" && cell.tagName === "td") {
            cell.properties = { ...cell.properties, dataLabel: headers[i] ?? "" };
            i++;
          }
        }
      });
    });
  };
}
