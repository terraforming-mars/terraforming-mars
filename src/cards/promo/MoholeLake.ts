import { IActionCard, ICard } from "./../ICard";
import { IProjectCard } from "./../IProjectCard";
import { Tags } from "./../Tags";
import { CardType } from "./../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardName } from '../../CardName';
import { ResourceType } from "../../ResourceType";
import { SelectCard } from "../../inputs/SelectCard";
import { LogHelper } from "../../components/LogHelper";

export class MoholeLake implements IActionCard, IProjectCard {
    public cost: number = 31;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.MOHOLE_LAKE;
    public cardType: CardType = CardType.ACTIVE;

    public play(player: Player, game: Game) {
        game.increaseTemperature(player, 1);
        game.addOceanInterrupt(player);
        player.plants += 3;
        return undefined;
    }

    public canAct(player: Player): boolean {
        const microbeCards = player.getResourceCards(ResourceType.MICROBE);
        const animalCards = player.getResourceCards(ResourceType.ANIMAL);
        return microbeCards.length > 0 || animalCards.length > 0;
    }

    public action(player: Player, game: Game) {
        const availableCards = player.getResourceCards(ResourceType.MICROBE).concat(player.getResourceCards(ResourceType.ANIMAL));
        if (availableCards.length === 1) {
          player.addResourceTo(availableCards[0]);
          LogHelper.logAddResource(game, player, availableCards[0], 1);
          return undefined;
        }
        
        return new SelectCard("Select card to add microbe or animal", availableCards, (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0]);
          LogHelper.logAddResource(game, player, foundCards[0], 1);
          return undefined;
        });
    }
}
