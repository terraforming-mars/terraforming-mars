import { Game } from "../Game";
import { PlayerInput } from "../PlayerInput";
import * as constants from "../constants";
import { Player } from "../Player";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { PlayerInterrupt } from "./PlayerInterrupt";
import { SpaceType } from "../SpaceType";

export class SelectOcean implements PlayerInterrupt {
    public playerInput?: PlayerInput;
    constructor(
        public player: Player,
        public game: Game,
        public title: string = 'Select space for ocean tile'
    ){}

    public generatePlayerInput() {
        if (this.game.board.getOceansOnBoard() >= constants.MAX_OCEAN_TILES) {
            this.playerInput = undefined;
            return;
        }
        this.playerInput = new SelectSpace(
            this.title,
            this.game.board.getAvailableSpacesForOcean(this.player),
            (space: ISpace) => {
                this.game.addOceanTile(this.player, space.id, SpaceType.OCEAN);
                return undefined;
            }
        );
    }
}