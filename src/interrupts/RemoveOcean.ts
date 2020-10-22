import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";
import { Player } from "../Player";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { LogHelper } from "../components/LogHelper";

export class RemoveOcean implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public title: string = "Select an Ocean tile to remove from board"
    ){}

    public generatePlayerInput() {
        if (this.game.board.getOceansOnBoard() === 0) {
            this.playerInput = undefined;
            return;
        }
        this.playerInput = new SelectSpace(
            this.title,
            // false: don't include upgraded oceans.
            this.game.board.getOceansTiles(false),
            (space: ISpace) => {
                this.game.removeTile(space.id);
                LogHelper.logBoardTileAction(this.game, this.player, space, "ocean tile", "removed");
                return undefined;
            }
        );
    }
}