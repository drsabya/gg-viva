<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase';
	import { signInWithEmailAndPassword } from 'firebase/auth';

	let email = '';
	let password = '';
	let loading = false;
	let errorMessage = '';

	async function handleSubmit() {
		errorMessage = '';
		loading = true;

		try {
			// 1. Firebase client sign-in
			const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

			// 2. Get ID token
			const idToken = await cred.user.getIdToken();

			// 3. Exchange it for a session cookie via our API
			const res = await fetch('/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ idToken })
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error || 'Failed to create session');
			}

			// 4. Redirect somewhere protected
			goto('/');
			// or goto('/cms') if your CMS starts there
		} catch (err: any) {
			console.error(err);
			errorMessage = err?.message ?? 'Login failed';
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-slate-50">
	<form
		class="w-full max-w-sm bg-white rounded-2xl shadow-md px-6 py-8 space-y-4"
		on:submit|preventDefault={handleSubmit}
	>
		<h1 class="text-xl font-semibold text-slate-800 mb-2">Sign in</h1>

		{#if errorMessage}
			<p class="text-sm text-red-600">{errorMessage}</p>
		{/if}

		<div class="space-y-1">
			<label class="block text-sm font-medium text-slate-700" for="email">Email</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				required
				class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
			/>
		</div>

		<div class="space-y-1">
			<label class="block text-sm font-medium text-slate-700" for="password">Password</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				required
				class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
			/>
		</div>

		<button
			type="submit"
			class="w-full rounded-lg bg-slate-900 text-white py-2.5 text-sm font-medium disabled:opacity-70"
			disabled={loading}
		>
			{#if loading}
				Signing in...
			{:else}
				Sign in
			{/if}
		</button>
	</form>
</div>
