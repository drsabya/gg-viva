// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { adminAuth } from '$lib/server/firebase-admin';

export const handle: Handle = async ({ event, resolve }) => {
	// Read the session cookie (we'll set this in /api/login later)
	const sessionCookie = event.cookies.get('session');

	if (!sessionCookie) {
		event.locals.user = null;
		return resolve(event);
	}

	try {
		// `adminAuth` is the Firebase Admin Auth instance you exported
		const decoded = await adminAuth.verifySessionCookie(sessionCookie, true); // `true` = check revocation

		event.locals.user = {
			uid: decoded.uid,
			email: decoded.email ?? null
		};
	} catch (err) {
		// Invalid/expired session → clear and treat as logged out
		event.locals.user = null;
		event.cookies.delete('session', { path: '/' });
	}

	return resolve(event);
};
