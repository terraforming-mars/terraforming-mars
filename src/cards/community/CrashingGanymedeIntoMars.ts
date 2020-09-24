import { Tags } from "../Tags";
import { CardName } from '../../CardName';
import { CardType } from "../CardType";
import { IProjectCard } from "../IProjectCard";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";
import { LogMessageType } from "../../LogMessageType";
import * as constants from "../../constants";
import { SpaceType } from "../../SpaceType";

export class CrashingGanymedeIntoMars implements IProjectCard {
    public cost: number = 0;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.CRASHING_GANYMEDE_INTO_MARS;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game) {
        player.hasConceded = true;
        this.maxOutAllGlobalParams(player, game);

        game.log(
            LogMessageType.DEFAULT,
            "${0} crashed Ganymede into Mars!",
            new LogMessageData(LogMessageDataType.PLAYER, player.id)
        );

        return undefined;
    }

    public getVictoryPoints() {
        return -99;
    }

    private maxOutAllGlobalParams(player: Player, game: Game) {
        (game as any).oxygenLevel = constants.MAX_OXYGEN_LEVEL;
        (game as any).temperature = constants.MAX_TEMPERATURE;
        
        for (const space of game.board.getSpaces(SpaceType.OCEAN, player)) {
          if (space.tile !== undefined) continue;
          if (game.board.getOceansOnBoard() === constants.MAX_OCEAN_TILES) break;
          game.addOceanTile(player, space.id, SpaceType.OCEAN, true);
        }
  
        if (game.gameOptions.venusNextExtension) (game as any).venusScaleLevel = constants.MAX_VENUS_SCALE;
        return undefined;
      }
}
