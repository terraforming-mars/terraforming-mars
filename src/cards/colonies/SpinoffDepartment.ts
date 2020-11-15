import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {Game} from '../../Game';

export class SpinoffDepartment implements IProjectCard {
    public cost = 10;
    public tags = [Tags.STEEL];
    public name = CardName.SPINOFF_DEPARTMENT
    public cardType = CardType.ACTIVE;

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
