<!-- src/routes/questions/create/+page.svelte -->
<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';

	// `form` comes from the action result (SvelteKit wires this up)
	let { data, form }: PageProps = $props();
</script>

<div class="w-full flex items-center justify-center py-10 px-4">
	<div
		class="w-full max-w-xl rounded-3xl border border-neutral-300 bg-neutral-50
		shadow-[0_14px_40px_rgba(0,0,0,0.05)] px-6 py-7 sm:px-8 sm:py-8
		text-neutral-900 font-mono"
	>
		<!-- Header -->
		<div class="flex items-center justify-between gap-3 mb-5">
			<p class="text-[11px] tracking-[0.2em] uppercase text-neutral-500">
				New Question
			</p>
			<div class="h-[1px] flex-1 bg-neutral-200"></div>
			<span
				class="text-[10px] px-2 py-0.5 rounded-full border border-neutral-300 text-neutral-500"
			>
				#{form?.questionNumber ?? data.nextQuestionNumber}
			</span>
		</div>

		<!-- Status / error -->
		{#if form?.error}
			<div
				class="mb-4 rounded-2xl border border-red-300 bg-red-50 px-3 py-2 text-[12px] text-red-800"
			>
				{form.error}
			</div>
		{/if}

		{#if form?.success}
			<div
				class="mb-4 rounded-2xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-800"
			>
				Saved as question #{form.questionNumber}.
			</div>
		{/if}

		<form
			method="POST"
			use:enhance
			class="space-y-5"
		>
			<!-- Question field -->
			<div class="space-y-2">
				<label
					for="question"
					class="block text-[11px] uppercase tracking-[0.18em] text-neutral-500"
				>
					Question
				</label>
				<textarea
					id="question"
					name="question"
					required
					class="w-full rounded-2xl border border-neutral-300 bg-white px-3 py-2.5
					text-[13px] leading-relaxed text-neutral-900
					focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900
					min-h-[90px] resize-y"
					placeholder="Type the question here…"
				>{form?.values?.question}</textarea>
			</div>

			<!-- Answer field -->
			<div class="space-y-2">
				<label
					for="answer"
					class="block text-[11px] uppercase tracking-[0.18em] text-neutral-500"
				>
					Answer
				</label>
				<textarea
					id="answer"
					name="answer"
					required
					class="w-full rounded-2xl border border-neutral-300 bg-white px-3 py-2.5
					text-[13px] leading-relaxed text-neutral-900
					focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900
					min-h-[110px] resize-y"
					placeholder="Type the ideal viva answer here…"
				>{form?.values?.answer}</textarea>
			</div>

			<!-- Actions -->
			<div class="pt-3 flex items-center justify-between">


				<button
					type="submit"
					class="inline-flex items-center justify-center rounded-2xl px-4 py-2
					text-[12px] font-semibold tracking-wide
					border border-neutral-300 bg-neutral-900 text-neutral-50
					hover:bg-neutral-800 active:bg-neutral-700
					transition-colors duration-150"
				>
					Save question →
				</button>
			</div>
		</form>
	</div>
</div>
