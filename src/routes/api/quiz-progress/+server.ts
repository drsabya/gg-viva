// src/routes/api/quiz-progress/+server.ts
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import '$lib/server/firebase-admin';

const db = getFirestore();

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	if (!user) {
		return json({ ok: false, error: 'Unauthorized' }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
	}

	const currentIndex = (body as { currentIndex?: unknown }).currentIndex;
	const quizId = (body as { quizId?: unknown }).quizId;

	if (typeof currentIndex !== 'number' || !Number.isFinite(currentIndex)) {
		return json(
			{ ok: false, error: 'currentIndex must be a finite number' },
			{ status: 400 }
		);
	}

	await db.collection('quizProgress').doc(user.uid).set(
		{
			currentIndex,
			quizId: typeof quizId === 'string' ? quizId : 'default',
			updatedAt: FieldValue.serverTimestamp()
		},
		{ merge: true }
	);

	return json({ ok: true });
};
