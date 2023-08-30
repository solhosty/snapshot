import { notSubmitted, submitted } from "$lib/states/state";

export function saveJSON(owners: any) {
    if (typeof document === "undefined") return;  // Guard for server-side rendering
    const blob = new Blob([JSON.stringify(owners)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
  }

export function saveCSV(owners: any) {
  const csvContent = 'data:text/csv;charset=utf-8,' + owners;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'data.csv');
  link.click();
}

export function copyResults(owners: any) {
  navigator.clipboard.writeText(JSON.stringify(owners));
}
