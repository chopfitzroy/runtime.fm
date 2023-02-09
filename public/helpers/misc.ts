export const empty = (value: unknown) => {
	if (value === null) {
		return true;
	}
	if (value === undefined) {
		return true;
	}
	return false;
}

