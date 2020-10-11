import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Resources } from "../../Resources";
import { Game } from '../../Game';

export class SpinoffDepartment implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.SPINOFF_DEPARTMENT
    public cardType: CardType = CardType.ACTIVE;
    public onCardPlayerPriority: number = 10;

    public onCardPlayed(player: Player, game: Game, card: IProjectCard) {
        if (card.cost >= 20) {
            player.cardsInHand.push(game.dealer.dealCard());
        }
    }

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 2);  
      return undefined;
    }
}
