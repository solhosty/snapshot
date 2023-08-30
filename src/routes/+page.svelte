<script>
	// @ts-nocheck
	import { collection } from '$lib/functions/collection';
	import { notSubmitted, submitted } from '$lib/states/state';
	import formatHighlight from 'json-format-highlight';
	let address = '';
	/**
	 * @type {string | any[]}
	 */
	let owners = [];
	/**
	 * @type {number | never[]}
	 */
	let assetList = [];
	let results;
	async function fetchData() {
		submitted.set(true)
		notSubmitted.set(true)
		results = await collection(address);
		owners = results
		submitted.set(false)
	}
	$: totalCount = owners.length;
	$: results = owners
	$: metadataHTML = formatHighlight(JSON.stringify(owners || {}, null, 2), {
		keyColor: '#a5a3a3',
		numberColor: '#e8a034',
		stringColor: '#24ae67'
	});
	function copyResults() {
		navigator.clipboard.writeText(JSON.stringify(owners));
	}

	function saveJSON() {
		const blob = new Blob([JSON.stringify(owners)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'data.json';
		a.click();
	}

	function saveCSV() {
		// Convert JSON to CSV logic here
		const csvContent = 'data:text/csv;charset=utf-8,' + 'Your CSV Content';
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', 'data.csv');
		link.click();
	}
</script>
<div class="p-4 flex justify-center items-center bg-black min-h-screen">
	<div class="text-center border border-gray-500  border-2 p-6 rounded-lg">
		<h1 class="bg-black text-white  text-center my-4 text-3xl"> Snapshot</h1>

		<div class="mb-4 flex justify-center">
			<input
				type="text"
				placeholder="Enter address"
				bind:value={address}
				class="input text-white w-100 rounded p-2"
			/>
			<button on:click={fetchData} class="btn text-white rounded p-2 ml-2"> Fetch Data </button>
		</div>
		{#if totalCount > 0}
			<span class="ml-4 text-white">
				Total Owners: {totalCount}
			</span>
		{/if}
		{#if $submitted}
			<img class="w-2/6 m-auto" src="/spinner.svg" alt="">
			{/if }
			{#if !$submitted && $notSubmitted}
		<div>
			
			<div
				class="relative bg-black rounded p-4 flex flex-col overflow-y-auto text-white"
				style="max-height: 300px;"
			>
			
			
				<pre>{@html metadataHTML}</pre>
				<button
					on:click={copyResults}
					class="absolute top-0 right-0 bg-green-500 text-white rounded p-2"
				>
					Copy
				</button>
			</div>

			<button on:click={saveJSON} class="btn text-white rounded p-2 mt-4"> Save as JSON </button>

			<button on:click={saveCSV} class="btn text-white rounded p-2 mt-4 ml-4"> Save as CSV </button>

		</div>
		{/if}

	</div>
</div>
