export const parseJson = <TReturn = unknown>(
	json?: string | null | undefined,
	fallback: unknown = [],
): TReturn => {
	if (!json) return fallback as TReturn;
	try {
		return JSON.parse(json) as TReturn;
	} catch (e) {
		return fallback as TReturn;
	}
};
