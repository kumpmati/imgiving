/* eslint-disable @typescript-eslint/no-explicit-any */

export const debounce = <T extends (...args: any) => any>(callback: T, wait: number) => {
	let timeoutId: any = null;

	return (...args: Parameters<T>): ReturnType<T> => {
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			callback(...args);
		}, wait);

		return null as any;
	};
};
