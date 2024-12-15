export class Character {
    private static space: string = `${" "}`;
    private static clear: string = "clear";

    // getters
    public static getSpace(): string {
        return this.space;
    }

    public static getClear(): string {
        return this.clear;
    }
}