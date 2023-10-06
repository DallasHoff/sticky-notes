<script lang="ts">
	import FaNotes from '$icon/fa-notes.svelte';
</script>

<div class="note-list-placeholder">
	<h2>Nothing Here</h2>
	<div class="note-list-placeholder__image">
		<FaNotes />
	</div>
	<p>Add a note using the button in the bottom right.</p>
</div>

<style lang="scss">
	.note-list-placeholder {
		min-width: 10rem;
		width: 60vw;
		max-width: 15rem;
		margin: 15vh auto 0;
		text-align: center;
		opacity: 0.7;

		h2 {
			margin: 0 0 1.5rem 0;
		}

		p {
			font-size: 0.9em;
			margin: 1.5rem 0 0 0;
			text-wrap: balance;
		}

		&__image {
			width: 30%;
			margin: auto;
		}
	}
</style>
