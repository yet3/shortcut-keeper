import type { ICombinationSegment } from "@typings/combination.type";
import {
	KEY_END_SYMBOL,
	KEY_START_SYMBOL,
	SEPARATOR_CHORD_SYMBOL,
	SEPARATOR_SEQ_SYMBOL,
	SEPARATOR_SYMBOLS,
	SHORTCUT_PARSER_VERSION,
} from "./consts";

export const parseShortcutKeys = (
	combination: string,
	parserVersion = SHORTCUT_PARSER_VERSION,
): ICombinationSegment[] => {
	if (parserVersion !== SHORTCUT_PARSER_VERSION) {
		// TODO: handle this better
		throw new Error("Parser version not supported");
	}

	const segments: ICombinationSegment[] = [];

	let idx = 0;
	while (idx < combination.length) {
		let char = combination[idx];

		if (char === KEY_START_SYMBOL) {
			const seg: ICombinationSegment = {
				id: Math.random().toString(),
				kind: "key",
				displayValue: "",
			};
			idx++;
			while (idx < combination.length) {
				char = combination[idx];

				if (char === KEY_END_SYMBOL && combination[idx + 1] !== KEY_END_SYMBOL) {
					segments.push(seg);
					break;
				}

				seg.displayValue += char;
				idx++;
			}
		} else if (SEPARATOR_SYMBOLS.includes(char)) {
			const isChord = char === SEPARATOR_CHORD_SYMBOL;
			segments.push({
				id: Math.random().toString(),
				kind: isChord ? "separator-chord" : "separator-seq",
				displayValue: isChord ? SEPARATOR_CHORD_SYMBOL : SEPARATOR_SEQ_SYMBOL,
			});

			char = combination[idx + 1];
			while (SEPARATOR_SYMBOLS.includes(char)) {
				idx++;
				char = combination[idx + 1];
			}
		}

		idx++;
	}

	return segments;
};
