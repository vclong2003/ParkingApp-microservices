export function parseEnum(enumValue?: string): string {
    if (!enumValue) return "";
    return enumValue
        .split("_")
        .map(word => word.toLowerCase().charAt(0).toUpperCase() + word.toLowerCase().slice(1))
        .join(" ");
}
