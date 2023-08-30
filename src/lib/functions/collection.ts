import { submitted } from "$lib/states/state";

export async function collection(address: string) {
		let page = 1;
        let paginate = true
        let assetList = [];
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
			assetList.push(...currentResults);
			if (currentResults.length !== 1000) {
				paginate = false;
			} else {
				page++;
			}
			results = assetList;
			totalCount = assetList.length;
		}
        return results
	}