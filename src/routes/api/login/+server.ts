// src/routes/api/login/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { adminAuth } from '$lib/server/firebase-admin';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { idToken } = await request.json();

		if (!idToken || typeof idToken !== 'string') {
			return json({ ok: false, error: 'idToken is required' }, { status: 400 });
		}

		// Optional but good: verify once here
		const decoded = await adminAuth.verifyIdToken(idToken);

		// Session lifetime: e.g. 5 days
		const expiresIn = 1000 * 60 * 60 * 24 * 5;

		const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

		// Set HTTP-only cookie so the browser can't touch it
		cookies.set('session', sessionCookie, {
			httpOnly: true,
			secure: true, // set to true in production (HTTPS)
			sameSite: 'lax',
			path: '/',
			maxAge: expiresIn / 1000
		});

		return json({
			ok: true,
			uid: decoded.uid,
			email: decoded.email ?? null
		});
	} catch (err) {
		console.error('Error in /api/login:', err);
		return json({ ok: false, error: 'Failed to create session' }, { status: 401 });
	}
};
