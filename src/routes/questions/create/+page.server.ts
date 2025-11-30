// src/routes/questions/create/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';

type QuestionDoc = {
	question?: string;
	answer?: string;
	questionNumber?: number;
	createdAt?: FirebaseFirestore.Timestamp;
};

export const load = (async () => {
	// Get the highest existing questionNumber
	const snapshot = await adminDb
		.collection('questions')
		.orderBy('questionNumber', 'desc')
		.limit(1)
		.get();

	let nextQuestionNumber = 1;

	if (!snapshot.empty) {
		const doc = snapshot.docs[0];
		const data = doc.data() as QuestionDoc;
		nextQuestionNumber = (data.questionNumber ?? 0) + 1;
	}

	return { nextQuestionNumber };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const question = String(formData.get('question') ?? '').trim();
		const answer = String(formData.get('answer') ?? '').trim();

		if (!question || !answer) {
			return fail(400, {
				error: 'Both question and answer are required.',
				values: { question, answer }
			});
		}

		// Compute next questionNumber (server is the source of truth)
		const snapshot = await adminDb
			.collection('questions')
			.orderBy('questionNumber', 'desc')
			.limit(1)
			.get();

		let nextQuestionNumber = 1;

		if (!snapshot.empty) {
			const doc = snapshot.docs[0];
			const data = doc.data() as QuestionDoc;
			nextQuestionNumber = (data.questionNumber ?? 0) + 1;
		}

		await adminDb.collection('questions').add({
			question,
			answer,
			questionNumber: nextQuestionNumber,
			createdAt: new Date()
		});

		return {
			success: true,
			questionNumber: nextQuestionNumber
		};
	}
};
