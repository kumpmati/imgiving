import { z } from 'zod';

export const signInFormSchema = z.object({
	name: z.string().max(40).min(1)
});
