import { readFileSync } from "fs";
import FlowGame from "../flow";

const prefix = "./src/__tests__/unsolved_boards/";
const fileList = ["bonus_5x5_9.txt", "classic_5x5_1.txt", "bonus_5x5_22.txt", "bonus_5x5_27.txt", "bonus_6x6_10.txt", "bonus_9x9_24.txt"];

fileList.forEach((file) => {
    test(`solves ${file}`, () => {

        const contents = readFileSync(prefix + file, "utf-8");
        const lines = contents.split(/\r?\n/);
        const board = [];
        lines.forEach((line) => {
            board.push(line.split(""));
        });
        const game = new FlowGame(board);
        game.solve();
        expect(game.checkComplete()).toBeTruthy();
    });
});
