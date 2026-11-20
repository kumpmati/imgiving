import { createContext } from 'svelte';
import { Toasts } from './state.svelte';

export const [getToast, setToastContext] = createContext<Toasts>();
