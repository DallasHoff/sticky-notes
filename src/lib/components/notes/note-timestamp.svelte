<script lang="ts">
	import type { Note } from '$lib/stores/notes';

	export let note: Note;

	const timestampOptions: Intl.DateTimeFormatOptions = {
		dateStyle: 'short',
		timeStyle: 'short',
	};

	let timestampDate: Date;
	let timestamp: string;

	$: {
		timestampDate = new Date(note.updatedAt * 1000);
		timestamp = new Intl.DateTimeFormat(undefined, timestampOptions).format(timestampDate);
	}
</script>

<time datetime={timestampDate.toISOString()}>
	{timestamp}
</time>

<style lang="scss">
	time {
		font-size: 0.85em;
		text-align: right;
		color: hsl(0 0% 0% / 0.5);
	}
</style>
