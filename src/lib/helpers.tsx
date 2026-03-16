

export function formatNumberAbbreviated(num: number): string {
    if (num < 1000) return num.toString();

    const units = ["k", "M", "B", "T"];
    let unitIndex = -1;
    let value = num;

    while (value >= 1000 && unitIndex < units.length - 1) {
        value /= 1000;
        unitIndex++;
    }

    const formatted = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);

    return `${formatted}${units[unitIndex]}`;
}
