// src/app.d.ts
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// Data attached to each request on the server
		interface Locals {
			user: {
				uid: string;
				email: string | null;
			} | null;
		}

		// You can extend other interfaces here later if needed:
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
