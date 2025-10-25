import { getContext } from 'svelte';
import { Toasts } from './state.svelte';

export const toastKey = Symbol('toast');

export const getToast = () => getContext<Toasts>(toastKey);
