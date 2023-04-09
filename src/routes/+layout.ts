import { dev } from '$app/environment';

export const ssr = !dev;
export const prerender = !dev;
