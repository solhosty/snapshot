import { submitted } from "$lib/states/state";
let uniqueOwners = new Set(); // To store unique owners

export async function collection(address: string) {
		let page = 1;
        let paginate = true
		uniqueOwners.clear(); // Clear the previous unique owners
        let assetList = [];
		let unique: unknown[] = [];
        let results = [];
        let totalCount: any;
		while (paginate) {
			const url = `https://rpc.helius.xyz/?api-key=0dcc9598-3e99-4369-964b-91b31c60ac04`;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: 'my-id',
					method: 'getAssetsByGroup',
					params: {
						groupKey: 'collection',
						groupValue: `${address}`,
						page: page
					}
				})
			});
			const data = await response.json();

			const currentResults = data.result.items.map((item: any) => item.ownership.owner);
			currentResults.forEach((owner: unknown) => uniqueOwners.add(owner));

			assetList.push(...currentResults);
			if (currentResults.length !== 1000) {
				paginate = false;
			} else {
				page++;
			}
			results = assetList;
			unique = Array.from(uniqueOwners);
			totalCount = assetList.length;
		}
        return {results, unique}
	}