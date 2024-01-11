import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { H3 } from "./H3";
import { H4 } from "./H4";

interface TableProps {
  caption: string;
  headRow: string[];
  rows: string[][];
}

/**
 *
 * @param caption title of table
 * @param headRow array of column headers
 * @param rows Array of string arrays representing a row
 * @returns
 */
export function Table({
  caption,
  headRow,
  rows,
  className,
  ...divProps
}: TableProps & ComponentProps<"div">) {
  return (
    <div className={cn("my-6 w-full overflow-y-auto", className)} {...divProps}>
      <table className="w-full">
        <caption className="m-0 border p-0 px-4 py-2 text-left">
          <H3>{caption}</H3>
        </caption>
        <thead>
          <tr className="m-0 border-t p-0 even:bg-muted">
            {headRow.map((heading) => (
              <th className="border px-4 py-2 text-left  [&[align=center]]:text-center [&[align=right]]:text-right">
                <H4>{heading}</H4>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="m-0 border-t p-0 even:bg-muted">
              {row.map((cell) => (
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
