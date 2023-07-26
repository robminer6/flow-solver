export default class UserBoard {
    constructor() {
        this.width = 0
        this.height = 0
        this.colors = new Map([
            ["Y", "#ffff00"],
            ["R", "#ff0000"],
            ["B", "#0000ff"],
            ["C", "#00ffff"],
            ["O", "#ffa500"],
            ["G", "#008000"],
            ["L", "#00ff00"],
            ["M", "#ff00ff"],
            ["P", "#A020F0"],
            ["A", "#800000"],
            ["S", "#808080"],
            ["W", "#FFFFFF"],
            [".", "none"],
        ])
    }

    width: number

    height: number

    private colors: Map<string, string>

    getColorCode(input: string) {
        try {
            return this.colors.get(input)
        } catch (e: unknown) {
            return null
        }
    }


}
