import { Game } from "../Game";
import { Player } from "../Player";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { DeferredAction } from "./DeferredAction";

export class RemoveOceanTile implements DeferredAction {
    constructor(
        public player: Player,
        public game: Game,
        public title: string = "Select an Ocean tile to remove from board"
    ){}

    public execute() {
        if (this.game.board.getOceansOnBoard() === 0) {
            return;
        }
        return new SelectSpace(
            this.title,
            this.game.board.getOceansTiles(),
            (space: ISpace) => {
                this.game.removeTile(space.id);
                return undefined;
            }
        );
    }
}
