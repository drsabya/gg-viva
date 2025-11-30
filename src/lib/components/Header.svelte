<!-- src/lib/components/Header.svelte -->
<script lang="ts">
	import { UserRound } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	let isOpen = $state(false);
	let loggingOut = $state(false);

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	async function handleLogout() {
		loggingOut = true;

		try {
			await fetch('/api/logout', {
				method: 'POST'
			});

			// After clearing cookie, go to login
			goto('/login');
		} catch (err) {
			console.error('Logout failed', err);
		} finally {
			loggingOut = false;
			isOpen = false;
		}
	}
</script>

<header class="w-full border-b border-slate-200 bg-white">
	<div class="mx-auto  px-6 py-3 flex items-center justify-between">
		<a href="/" class="text-sm font-mono tracking-[0.25em] uppercase text-slate-800">
			GG-viva
		</a>

		<div class="relative">
			<button
				type="button"
				class="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-2 hover:bg-slate-100 active:bg-slate-200 transition-colors"
				onclick={toggleDropdown}
				aria-haspopup="menu"
				aria-expanded={isOpen}
			>
				<UserRound class="w-5 h-5 text-slate-700" />
			</button>

			{#if isOpen}
				<div
					class="absolute right-0 mt-2 w-40 rounded-xl border border-slate-200 bg-white shadow-lg py-1 text-sm z-50"
				>
					<button
						type="button"
						class="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
						onclick={handleLogout}
						disabled={loggingOut}
					>
						{#if loggingOut}
							Logging out…
						{:else}
							Log out
						{/if}
					</button>
				</div>
			{/if}
		</div>
	</div>
</header>
