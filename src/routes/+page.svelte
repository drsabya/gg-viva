<!-- src/routes/+page.svelte -->
<script lang="ts">
	import QuizCard from '$lib/components/QuizCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { user, questions, currentIndex: initialIndex } = data;

	let index = $state(initialIndex ?? 0);

	function clampIndex(value: number) {
		if (!questions || questions.length === 0) return 0;
		if (value < 0) return 0;
		if (value >= questions.length) return questions.length - 1;
		return value;
	}

	async function persistProgress(newIndex: number) {
		try {
			await fetch('/api/quiz-progress', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					currentIndex: newIndex,
					quizId: 'default' // or any id you like
				})
			});
		} catch (err) {
			console.error('Failed to save quiz progress', err);
		}
	}

	function handleNextQuestion() {
		if (!questions || questions.length === 0) return;
		const newIndex = clampIndex(index + 1);
		index = newIndex;
		persistProgress(newIndex);
	}

	function handlePrevQuestion() {
		if (!questions || questions.length === 0) return;
		const newIndex = clampIndex(index - 1);
		index = newIndex;
		persistProgress(newIndex);
	}

	const totalQuestions = $derived(questions?.length ?? 0);
	const currentQuestion = $derived(
		questions && questions.length > 0 ? questions[index] : null
	);
</script>

<div class="flex justify-center bg-neutral-100">
	<div
		class="flex flex-col items-center justify-center font-mono p-6 sm:p-8 max-w-2xl w-full"
	>
		{#if !questions || questions.length === 0}
			<div
				class="w-full max-w-xl rounded-3xl border border-dashed border-neutral-300 bg-neutral-50
				       px-6 py-7 sm:px-8 sm:py-8 text-center text-sm text-neutral-600 mb-4"
			>
				<p>No questions found yet.</p>
				<p class="mt-2">
					<a href="/questions/create" class="underline text-neutral-800">
						Create your first question
					</a>
				</p>
			</div>
		{:else if currentQuestion}
			<QuizCard
				question={currentQuestion.question}
				answer={currentQuestion.answer}
				index={index}
				total={totalQuestions}
				onNext={handleNextQuestion}
				onPrev={handlePrevQuestion}
			/>

			<a
				class="mt-4 text-xs text-neutral-400 hover:underline"
				href="/questions/create"
			>
				Create a new question
			</a>
		{/if}
	</div>
</div>
