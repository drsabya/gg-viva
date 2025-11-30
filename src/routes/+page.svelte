<script lang="ts">
	import QuizCard from '$lib/components/QuizCard.svelte';
	import type { PageData } from './$types';
	import { Plus } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();
	// Destructure initial data
	const { questions, currentIndex: initialIndex } = data;

	let index = $state(initialIndex ?? 0);
	
	// We still hold state here, but we bind it to the card
	let mode = $state<'quizmaster' | 'review'>('quizmaster');

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
					quizId: 'default'
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

<div class="w-full bg-neutral-100 flex flex-col items-center justify-center px-6 py-12 font-mono">
	
	{#if !questions || questions.length === 0}
		<div
			class="w-full max-w-md rounded-[2rem] border border-dashed border-neutral-300 bg-neutral-50/50
				   p-12 text-center text-sm text-neutral-500 flex flex-col items-center gap-4"
		>
			<div class="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-400">
				<Plus class="w-6 h-6" />
			</div>
			<p>No questions found yet.</p>
			<a 
				href="/questions/create" 
				class="px-5 py-2 rounded-full bg-neutral-900 text-neutral-50 text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors"
			>
				Create first question
			</a>
		</div>

	{:else if currentQuestion}
		
		<QuizCard
			bind:mode
			question={currentQuestion.question}
			answer={currentQuestion.answer}
			index={index}
			total={totalQuestions}
			onNext={handleNextQuestion}
			onPrev={handlePrevQuestion}
		/>

		<div class="mt-8 opacity-40 hover:opacity-100 transition-opacity duration-300">
			<a
				href="/questions/create"
				class="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-600 border-b border-transparent hover:border-neutral-400 pb-0.5"
			>
				<Plus class="w-3 h-3" />
				<span>Add New Question</span>
			</a>
		</div>

	{/if}
</div>