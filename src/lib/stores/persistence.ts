import { writable, type Readable } from 'svelte/store';

export class PersistenceStore implements Readable<boolean | null> {
	private persistence = writable<boolean | null>(null);

	get prompted() {
		return !!localStorage.promptedForPersistence;
	}
	private set prompted(value: boolean) {
		localStorage.promptedForPersistence = value;
	}

	constructor() {
		this.check();
	}

	subscribe = this.persistence.subscribe;

	async check() {
		if (navigator.storage && navigator.storage.persisted) {
			let persisted: boolean | null = await navigator.storage.persisted();

			if (persisted !== true) {
				persisted = this.prompted ? false : null;
			}

			this.persistence.set(persisted);
		}
	}

	async prompt() {
		this.prompted = true;

		if (navigator.storage && navigator.storage.persist) {
			const persisted = await navigator.storage.persist();
			this.persistence.set(persisted);
		}
	}
}
