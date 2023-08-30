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
	let uniques = []
	async function fetchData() {
		submitted.set(true)
		notSubmitted.set(true)
		const {results, unique} = await collection(address);
		owners = results
		uniques = unique
		submitted.set(false)
	}
	$: totalCount = owners.length;
	$: results = owners
	$: uniques = uniques.length
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
	<div class="text-center border border-gray-500 p-6 rounded-lg max-w-screen-md w-full  mx-4">
		<h1 class="bg-black text-white text-center mb text-3xl md:text-4xl">Snapshot</h1>
		<p class="mb-2"> Enter a collection address to get the holders</p>
		<div class="mb-4 flex justify-center flex-col md:flex-row">
			<input
				type="text"
				placeholder="Enter collection address"
				bind:value={address}
				class="input input-bordered text-white bg-transparent rounded p-2 w-full lg:w-full md:w-auto mb-2 md:mb-0 md:mr-2"
			/>
			<button on:click={fetchData} class="btn btn-bordered text-white rounded bg-transparent p-2 w-full md:w-auto">Submit</button>
		</div>
		
		{#if totalCount > 0}
			<p class="ml-4 text-white">
				Total Owners: {totalCount} Unique Owners: {uniques}
			</p>
		{/if}
		
		{#if $submitted}
			<img class="w-1/2 md:w-1/6 m-auto" src="/spinner.svg" alt="">
		{/if}
		
		{#if !$submitted && $notSubmitted}
		<div>
			
			<div
				class="relative bg-black rounded p-4 flex flex-col overflow-y-auto text-white max-h-[300px]"
			>
				<pre>{@html metadataHTML}</pre>
				<button
					on:click={copyResults}
					class="absolute top-0 right-0 bg-transparent text-white rounded p-2"
				>
					<img class="w-5" src="copy.svg" alt=""/>
				</button>
			</div>

			<div class="flex flex-col m-auto justify-center md:flex-row mt-4">
				<button on:click={saveJSON} class="btn btn-bordered bg-transparent text-white rounded p-2 mb-2 md:mb-0 md:mr-2">Save as JSON</button>
				<button on:click={saveCSV} class="btn btn-bordered bg-transparent text-white rounded p-2">Save as CSV</button>
			</div>

		</div>
		{/if}
	</div>
</div>
