import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const groupBy = <T>(arr: T[], map: (item: T) => string): Record<string, T[]> => {
	const grouped: Record<string, T[]> = {};

	for (const item of arr) {
		const key = map(item);

		grouped[key] ??= [];
		grouped[key].push(item);
	}

	return grouped;
};
