// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Allow public pages:
	if (url.pathname === '/login') {
		return { user: locals.user };
	}

	// Everything else requires login
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	// Pass user to layout/pages if needed
	return {
		user: locals.user
	};
};
