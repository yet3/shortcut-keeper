export interface ICombinationSegment {
  id: string
	kind: "key" | "separator-chord" | "separator-seq";
	displayValue: string;
}
