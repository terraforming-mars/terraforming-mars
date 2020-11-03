import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { CardType } from "../CardType";
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { SelectSpace } from "../../inputs/SelectSpace";
import { ISpace } from "../../ISpace";
import { TileType } from "../../TileType";
import { AresHandler } from "../../ares/AresHandler";

export class DesperateMeasures implements IProjectCard {
    public cost = 1;
    public tags = [Tags.EVENT];
    public cardType = CardType.EVENT;
    public name = CardName.DESPERATE_MEASURES;

    private getHazardTiles(game: Game) {
      return game.board.spaces.filter(space => AresHandler.hasHazardTile(space));
    }

    public canPlay(_player: Player, game: Game): boolean {
      // You can't play desperate measures if there isn't a hazard marker in play.
      return this.getHazardTiles(game).length > 0;
    }

    public play(player: Player, game: Game) {
      return new SelectSpace("Select a hazard space to protect", this.getHazardTiles(game), (space: ISpace) => {
        space.tile!.protectedHazard = true;
        const tileType = space.tile!.tileType;
        if (TileType.DUST_STORM_MILD  === tileType || TileType.DUST_STORM_SEVERE === tileType) {
          game.increaseOxygenLevel(player, 1);
        } else {
          // is an erosion tile when the expression above is false.
          game.increaseTemperature(player, 1);
        }
        return undefined;
    });
    }

    public getVictoryPoints() {
      return -2;
    }
}
