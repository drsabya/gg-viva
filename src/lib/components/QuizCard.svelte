<script lang="ts">
	import { 
		ChevronLeft, 
		ChevronRight, 
		Eye, 
		EyeOff, 
		Zap, 
		BookOpen 
	} from '@lucide/svelte';
	import { slide } from 'svelte/transition';

	type Mode = 'quizmaster' | 'review';

	interface Props {
		question?: string;
		answer?: string;
		index?: number;
		total?: number;
		onNext?: () => void;
		onPrev?: () => void;
		mode?: Mode; 
	}

	let {
		question = 'What is the mechanism of action of beta-blockers?',
		answer = 'They competitively block beta-adrenergic receptors, reducing the effects of catecholamines.',
		index = 0,
		total = 1,
		onNext,
		onPrev,
		mode = $bindable('quizmaster') // Made bindable so the local toggle works
	}: Props = $props();

	// In review mode, we track if the specific card is revealed
	let isRevealed = $state(false);

	// Reset reveal state when index or mode changes
	$effect(() => {
		index; // dependency
		mode;  // dependency
		isRevealed = false;
	});

	// Logic: In quizmaster, always show. In review, show only if revealed.
	const showContent = $derived(mode === 'quizmaster' || isRevealed);

	const progressPercent = $derived(
		total > 0 ? Math.round(((index ?? 0) + 1) / total * 100) : 0
	);

	function toggleReveal() {
		if (mode === 'review') isRevealed = !isRevealed;
	}

	// Keyboard navigation support
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') onNext?.();
		if (e.key === 'ArrowLeft') onPrev?.();
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault(); 
			toggleReveal();
		}
	}

	const isFirst = $derived((index ?? 0) <= 0);
	const isLast = $derived(total > 0 ? (index ?? 0) >= total - 1 : false);
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="w-full flex flex-col items-center justify-center py-12 font-mono text-neutral-900">
	
	<div
		class="relative w-full max-w-xl min-h-[320px] bg-white border border-neutral-200 
               rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] 
               flex flex-col justify-between overflow-hidden"
	>
		<div class="px-8 pt-8 pb-4">
			<div class="flex items-center justify-between text-[10px] uppercase tracking-widest text-neutral-400 mb-4">
				<span>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
				<span>{progressPercent}%</span>
			</div>
			
			<div class="w-full h-[2px] bg-neutral-100">
				<div 
					class="h-full bg-neutral-900 transition-all duration-500 ease-out"
					style={`width: ${progressPercent}%;`}
				></div>
			</div>
		</div>

		<div class="flex-1 px-8 py-2 flex flex-col gap-6">
			<div>
				<h3 class="text-lg leading-relaxed font-medium text-neutral-900">
					{question}
				</h3>
			</div>

			<div class="w-8 h-[1px] bg-neutral-200"></div>

			<button 
				type="button"
				onclick={toggleReveal}
				class="text-left w-full relative group outline-none"
				disabled={mode === 'quizmaster'}
			>
				{#if showContent}
					<div transition:slide={{ duration: 200 }} class="text-sm leading-7 text-neutral-600">
						{answer}
					</div>
					{#if mode === 'review'}
						<div class="mt-2 text-[10px] text-neutral-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
							(Click to hide)
						</div>
					{/if}
				{:else}
					<div class="h-24 w-full rounded-xl bg-neutral-50 border border-dashed border-neutral-200 
								flex flex-col items-center justify-center gap-2 cursor-pointer
								hover:bg-neutral-100 hover:border-neutral-300 transition-all group-focus:ring-2 ring-neutral-900 ring-offset-2">
						<Eye class="w-4 h-4 text-neutral-400" />
						<span class="text-[11px] text-neutral-400 uppercase tracking-widest">Tap to Reveal</span>
					</div>
				{/if}
			</button>
		</div>

		<div class="px-6 py-6 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
			<button
				onclick={onPrev}
				disabled={isFirst}
				class="h-10 w-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white
					   text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 hover:scale-105
					   disabled:opacity-30 disabled:hover:scale-100 disabled:hover:border-neutral-200 disabled:cursor-not-allowed
					   transition-all duration-200"
				aria-label="Previous"
			>
				<ChevronLeft class="w-4 h-4" />
			</button>

			<span class="text-[10px] text-neutral-300 uppercase tracking-widest select-none">
				{mode === 'review' ? 'Review Mode' : 'Quiz Mode'}
			</span>

			<button
				onclick={onNext}
				disabled={isLast}
				class="h-10 w-10 flex items-center justify-center rounded-full border border-neutral-200 bg-white
					   text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 hover:scale-105
					   disabled:opacity-30 disabled:hover:scale-100 disabled:hover:border-neutral-200 disabled:cursor-not-allowed
					   transition-all duration-200"
				aria-label="Next"
			>
				<ChevronRight class="w-4 h-4" />
			</button>
		</div>
	</div>

	<div class="mt-8 flex items-center p-1 bg-neutral-200/60 rounded-full">
		<button
			onclick={() => mode = 'quizmaster'}
			class="flex items-center gap-2 px-5 py-2 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-all duration-200
				   {mode === 'quizmaster' 
				   	? 'bg-neutral-900 text-white shadow-md' 
					: 'text-neutral-500 hover:text-neutral-900'}"
		>
			<Zap class="w-3 h-3" />
			<span>Quizmaster</span>
		</button>
		<button
			onclick={() => mode = 'review'}
			class="flex items-center gap-2 px-5 py-2 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-all duration-200
				   {mode === 'review' 
				   	? 'bg-neutral-900 text-white shadow-md' 
					: 'text-neutral-500 hover:text-neutral-900'}"
		>
			<BookOpen class="w-3 h-3" />
			<span>Review</span>
		</button>
	</div>

	<p class="mt-4 text-[10px] text-neutral-400">
		Use <kbd class="font-sans border border-neutral-300 rounded px-1">←</kbd> <kbd class="font-sans border border-neutral-300 rounded px-1">→</kbd> to navigate
	</p>
</div>