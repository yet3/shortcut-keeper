import type { ICombinationSegment } from "@typings/combination.type";
import {
	KEY_END_SYMBOL,
	KEY_START_SYMBOL,
	SEPARATOR_CHORD_SYMBOL,
	SEPARATOR_SEQ_SYMBOL,
	SHORTCUT_PARSER_VERSION,
} from "./consts";

export const combinationSegmentsToString = (
	segments: ICombinationSegment[],
	parserVersion = SHORTCUT_PARSER_VERSION,
): string => {
	if (parserVersion !== SHORTCUT_PARSER_VERSION) {
		// TODO: handle this better
		throw new Error("Parser version not supported");
	}

	let result = "";
	for (const segment of segments) {
		switch (segment.kind) {
			case "key":
				result += `${KEY_START_SYMBOL}${segment.displayValue}${KEY_END_SYMBOL}`;
				break;
			case "separator-chord":
				result += SEPARATOR_CHORD_SYMBOL;
				break;
			case "separator-seq":
				result += SEPARATOR_SEQ_SYMBOL;
				break;
		}
	}

	return result;
};
