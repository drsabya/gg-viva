// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getFirestore } from 'firebase-admin/firestore';
import '$lib/server/firebase-admin';

type QuestionDoc = {
	question: string;
	answer: string;
	questionNumber?: number;
};

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		throw redirect(303, '/login');
	}

	const db = getFirestore();

	// Load questions ordered by questionNumber
	const questionsSnap = await db
		.collection('questions')
		.orderBy('questionNumber', 'asc')
		.get();

	const questions = questionsSnap.docs.map((doc) => {
		const data = doc.data() as QuestionDoc;
		return {
			id: doc.id,
			question: data.question,
			answer: data.answer
		};
	});

	// Default to first question
	let currentIndex = 0;

	// Load saved progress (if any)
	const progressDoc = await db.collection('quizProgress').doc(user.uid).get();
	if (progressDoc.exists) {
		const prog = progressDoc.data() as { currentIndex?: number } | undefined;
		if (typeof prog?.currentIndex === 'number') {
			currentIndex = prog.currentIndex;
		}
	}

	// Clamp currentIndex
	if (questions.length === 0) {
		currentIndex = 0;
	} else {
		if (currentIndex < 0) currentIndex = 0;
		if (currentIndex >= questions.length) currentIndex = questions.length - 1;
	}

	return {
		user,
		questions,
		currentIndex
	};
};
