import { Game } from "../Game";
import { Player } from "../Player";
import { SelectCard } from "./SelectCard";
import { ResourceType } from "../ResourceType";
import { ICard } from "../cards/ICard";
import { LogHelper } from "../components/LogHelper";
export class SelectResourceCard {
    public static newInstance(game: Game, player: Player, resourceType: ResourceType, cards: Array<ICard>, count: number, title?: string): SelectCard<ICard> {
        if (title === undefined) {
            title = "Select card to add " + count + " " + resourceType + " resource(s)";
        }
        return new SelectCard(
            title,
            "Add resource(s)",
            cards,
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], count);
              LogHelper.logAddResource(game, player, foundCards[0], count);
              return undefined;
            }
          );
    }
}    
