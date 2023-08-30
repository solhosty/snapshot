<script>
	// @ts-nocheck
	import { collection } from '$lib/functions/collection';
	import { saveJSON, saveCSV, copyResults } from '$lib/functions/utils';
	import { notSubmitted, submitted } from '$lib/states/state';
	import formatHighlight from 'json-format-highlight';

	let address = '';
	let owners = [];
	let allResponse = [];
	let uniqueResponse = [];
	let sendUniqueOwners = true;

	async function fetchData() {
		submitted.set(true);
		notSubmitted.set(true);
		const { results, unique } = await collection(address);
		allResponse = results;
		uniqueResponse = unique;
		submitted.set(false);
	}
	$: {
		if (sendUniqueOwners === true) {
			owners = uniqueResponse;
		} else if (sendUniqueOwners === false) {
			owners = allResponse;
		}
	}
	$: resultLength = allResponse.length;
	$: uniquesLength = uniqueResponse.length;
	$: metadataHTML = formatHighlight(JSON.stringify(owners || {}, null, 2), {
		keyColor: '#a5a3a3',
		numberColor: '#e8a034',
		stringColor: '#24ae67'
	});
</script>

<div class="p-4 flex justify-center items-center bg-black min-h-screen">
	<div
		class="text-center border border-gray-500 border-opacity-40 p-6 rounded-lg max-w-screen-md w-full mx-4"
	>
		<h1 class="bg-black text-white text-center mb-1 text-3xl md:text-4xl">Snapshot</h1>
		<p class="mb-3">Enter a collection address to get the holders</p>
		<div class="mb-4 flex justify-center flex-col md:flex-row">
			<input
				type="text"
				placeholder="Enter collection address"
				bind:value={address}
				class="input input-bordered text-white bg-transparent rounded p-2 w-full lg:w-full md:w-auto mb-2 md:mb-0 md:mr-2"
			/>
			<button
				on:click={fetchData}
				class="btn btn-bordered text-white rounded bg-transparent p-2 w-full md:w-auto"
				>Submit</button
			>
		</div>

		{#if resultLength > 0}
			<div class="stats bg-transparent text-white stats-verticallg:stats-horizontal shadow">
				<div class="stat">
					<p class="stat-title text-gray-300">Total Owners</p>
					<div class="stat-value">{resultLength}</div>
				</div>

				<div class="stat">
					<div class="stat-title text-gray-300">Unique Owners</div>
					<div class="stat-value">{uniquesLength}</div>
				</div>
			</div>
		{/if}

		{#if $submitted}
			<img class="w-1/2 md:w-1/6 m-auto" src="/spinner.svg" alt="" />
		{/if}
		{#if resultLength > 0}
			<p class="label-text my-2 text-gray-300">Unique Owners</p>
			<input type="checkbox" class="toggle" bind:checked={sendUniqueOwners} />
		{/if}

		{#if !$submitted && $notSubmitted && resultLength > 0}
			<div>
				<div
					class="relative bg-black rounded p-4 flex flex-col overflow-y-auto text-white max-h-[300px]"
				>
					<div
						class="code text-xs whitespace-pre overflow-x-hidden px-3 col-span-12 hide-scrollbar"
					>
						<pre><code class="text-xs">{@html metadataHTML}</code></pre>
					</div>

					<div class="flex flex-col">
						<div class="absolute top-0 right-0">
							<div class="tooltip" data-tip="Copy all results">
								<button
									on:click={copyResults(owners)}
									class="bg-transparent text-white rounded p-2"
								>
									<img class="w-5" src="copy.svg" alt="" />
								</button>
							</div>
						</div>
					</div>
				</div>

				<div class="flex flex-col m-auto justify-center md:flex-row mt-4">
					<button
						on:click={saveJSON(owners)}
						class="btn btn-bordered bg-transparent text-white rounded p-2 mb-2 md:mb-0 md:mr-2"
						>Save as JSON</button
					>
					<button
						on:click={saveCSV(owners)}
						class="btn btn-bordered bg-transparent text-white rounded p-2">Save as CSV</button
					>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.hide-scrollbar {
		scrollbar-width: none; /* Firefox */
	}

	.hide-scrollbar::-webkit-scrollbar {
		width: 0px; /* Webkit */
	}
</style>
