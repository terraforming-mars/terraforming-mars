import { CorporationCard } from "./CorporationCard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { SelectSpace } from "../../inputs/SelectSpace";
import { SpaceType } from "../../SpaceType";
import { ISpace } from "../../ISpace";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';
import { LogMessageType } from "../../LogMessageType";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";
import { Board } from "../../Board";

export class TharsisRepublic implements CorporationCard {
    public name: CardName = CardName.THARSIS_REPUBLIC;
    public tags: Array<Tags> = [Tags.STEEL];
    public startingMegaCredits: number = 40;
    public initialAction(player: Player, game: Game) {
        return new SelectSpace("Select space on mars for city tile", game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
            game.addCityTile(player, space.id);
            
            game.log(
                LogMessageType.DEFAULT,
                "${0} placed a City tile",
                new LogMessageData(LogMessageDataType.PLAYER, player.id)
            );
            
            return undefined;
        });
    }
    public onTilePlaced(player: Player, space: ISpace) {
        if (Board.isCitySpace(space)) {
            if (space.player === player) {
                player.megaCredits += 3;
            }
            if (space.spaceType !== SpaceType.COLONY) {
                if (player.shouldTriggerCardEffect) player.setProduction(Resources.MEGACREDITS);
                player.shouldTriggerCardEffect = true; // reset value
            }
        }
    }
    public play(player: Player, game: Game) {
        if (game.getPlayers().length == 1) {
            // Get bonus for 2 neutral cities
            player.setProduction(Resources.MEGACREDITS,2);
        }
        return undefined;
    }
}
