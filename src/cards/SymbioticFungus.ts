
import { Tags } from "./Tags";
import { IActionCard, ICard } from './ICard';
import { IProjectCard } from "./IProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";
import { SelectCard } from "../inputs/SelectCard";
import { ResourceType } from '../ResourceType';
import { CardName } from '../CardName';
import { LogMessageType } from "../LogMessageType";
import { LogMessageData } from "../LogMessageData";
import { LogMessageDataType } from "../LogMessageDataType";

export class SymbioticFungus implements IActionCard, IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.ACTIVE;
    public name: CardName = CardName.SYMBIOTIC_FUNGUS;
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= -14 - (2 * player.getRequirementsBonus(game));
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.getResourceCards(ResourceType.MICROBE).length > 0;
    }
    public action(player: Player, game: Game) {
        const availableCards = player.getResourceCards(ResourceType.MICROBE);

        if (availableCards.length === 1) {
            player.addResourceTo(availableCards[0]);
            this.logAddMicrobeAction(game, player, availableCards[0]);
            return undefined;
        }

        return new SelectCard("Select card to add microbe", availableCards, (foundCards: Array<ICard>) => {
            player.addResourceTo(foundCards[0]);
            this.logAddMicrobeAction(game, player, foundCards[0]);
            return undefined;
        });
    }
    private logAddMicrobeAction(game: Game, player: Player, card: ICard) {
        game.log(
            LogMessageType.DEFAULT,
            "${0} added 1 microbe to ${1}",
            new LogMessageData(LogMessageDataType.PLAYER, player.id),
            new LogMessageData(LogMessageDataType.CARD, card.name)
        )
    }
}
 
