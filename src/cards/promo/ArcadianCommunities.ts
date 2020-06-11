import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CorporationCard } from '../corporation/CorporationCard';
import { SelectSpace } from "../../inputs/SelectSpace";
import { ISpace } from '../../ISpace';
import { IActionCard } from '../ICard';
import { CardName } from '../../CardName';
import { LogMessageType } from "../../LogMessageType";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";

export class ArcadianCommunities implements IActionCard, CorporationCard {
    public name: CardName = CardName.ARCADIAN_COMMUNITIES;
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 40; 

    public initialAction(player: Player, game: Game) {
        return new SelectSpace(
            "Select space for claim", 
            game.board.getAvailableSpacesOnLand(player), 
            (foundSpace: ISpace) => {
                foundSpace.player = player;
                
                game.log(
                    LogMessageType.DEFAULT,
                    "${0} placed a Community (player marker)",
                    new LogMessageData(LogMessageDataType.PLAYER, player.id)
                );

                return undefined;
            }
        );
    }

    public canAct(player: Player, game: Game): boolean {
        return game.board.getAvailableSpacesForMarker(player).length > 0; 
    }

    public action(player: Player, game: Game) {
        return new SelectSpace(
            "Select space for claim", 
            game.board.getAvailableSpacesForMarker(player), 
            (foundSpace: ISpace) => {
                foundSpace.player = player;
                return undefined;
            }
        );
    }

    public play(player: Player) {
        player.steel = 10;
        return undefined;
    }
}
