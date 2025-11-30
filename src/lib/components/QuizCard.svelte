<!-- src/lib/components/QuizCard.svelte -->
<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	interface Props {
		question?: string;
		answer?: string;
		index?: number;
		total?: number;
		onNext?: () => void;
		onPrev?: () => void;
	}

	let {
		question = 'What is the mechanism of action of beta-blockers?',
		answer = 'They competitively block beta-adrenergic receptors, reducing the effects of catecholamines.',
		index = 0,
		total = 1,
		onNext,
		onPrev
	}: Props = $props();

	let showAnswer = $state(false);

	$effect(() => {
		question;
		showAnswer = false;
	});

	const progressPercent = $derived(
		total > 0 ? Math.round(((index ?? 0) + 1) / total * 100) : 0
	);

	function handleShowAnswerToggle() {
		showAnswer = !showAnswer;
	}

	function handleNext() {
		if (onNext) onNext();
	}

	function handlePrev() {
		if (onPrev) onPrev();
	}

	const isFirst = $derived((index ?? 0) <= 0);
	const isLast = $derived(total > 0 ? (index ?? 0) >= total - 1 : false);
</script>

<div class="w-full flex items-center justify-center py-10">
	<div
		class="w-full max-w-xl min-h-[380px] rounded-3xl border border-neutral-300 bg-neutral-50
        shadow-[0_14px_40px_rgba(0,0,0,0.05)] px-6 py-7 sm:px-8 sm:py-8
        text-neutral-900 font-mono flex flex-col justify-between"
	>
		<!-- Progress bar -->
		<div>
			<div class="mb-5">
				<div class="flex items-center justify-between mb-1">
					<span class="text-[11px] text-neutral-500">
						Question {Math.min(index + 1, total)} of {total}
					</span>
					<span class="text-[11px] text-neutral-500">
						{progressPercent}%
					</span>
				</div>
				<div class="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
					<div
						class="h-full bg-neutral-900 transition-[width] duration-300"
						style={`width: ${progressPercent}%;`}
					></div>
				</div>
			</div>

			<div class="space-y-4">
				<div>
					<!-- <p class="text-xs uppercase tracking-[0.18em] text-neutral-500 mb-1">
						Question
					</p> -->
					<br>
					<p class="text-sm sm:text-[15px] leading-relaxed text-neutral-900">
						{index + 1}. {question}
					</p>
				</div>

				{#if showAnswer}
					<div class="pt-3">
						<p class="text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-2">
							Answer
						</p>
						<div
							class="rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-[13px]
                                   leading-relaxed text-neutral-800"
						>
							{answer}
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Navigation + Show Answer controls -->
		<div class="mt-8 flex items-center justify-between gap-4">
			<!-- Previous -->
			<button
				type="button"
				onclick={handlePrev}
				disabled={isFirst}
				class="inline-flex h-9 w-9 items-center justify-center rounded-full border
					border-neutral-300 bg-white text-neutral-700
					disabled:opacity-40 disabled:cursor-not-allowed
					hover:bg-neutral-100 active:bg-neutral-200
					transition-colors duration-150"
				aria-label="Previous question"
			>
				<ChevronLeft class="h-4 w-4" />
			</button>

			<!-- Show / Hide answer -->
			<button
				type="button"
				onclick={handleShowAnswerToggle}
				class="inline-flex items-center justify-center rounded-2xl px-4 py-2
                    text-[12px] font-semibold tracking-wide
                    border border-neutral-300 bg-neutral-900 text-neutral-50
                    hover:bg-neutral-800 active:bg-neutral-700
                    transition-colors duration-150"
			>
				{showAnswer ? 'Hide answer' : 'Show answer'}
			</button>

			<!-- Next -->
			<button
				type="button"
				onclick={handleNext}
				disabled={isLast}
				class="inline-flex h-9 w-9 items-center justify-center rounded-full border
					border-neutral-300 bg-white text-neutral-700
					disabled:opacity-40 disabled:cursor-not-allowed
					hover:bg-neutral-100 active:bg-neutral-200
					transition-colors duration-150"
				aria-label="Next question"
			>
				<ChevronRight class="h-4 w-4" />
			</button>
		</div>
	</div>
</div>
