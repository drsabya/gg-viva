// src/routes/api/logout/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
	// Clear the Firebase session cookie
	cookies.delete('session', { path: '/' });

	return json({ ok: true });
};
