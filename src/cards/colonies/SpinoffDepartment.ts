import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SpinoffDepartment implements IProjectCard {
    public cost = 10;
    public tags = [Tags.BUILDING];
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
    public metadata: CardMetadata = {
      cardNumber: 'C41',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.megacredits(20).asterix().startEffect.cards(1);
          eb.description('Effect: WHEN PLAYING A CARD WITH A BASIC COST OF 20MC OR MORE, draw a card.');
        }).br;
        b.productionBox((pb) => pb.megacredits(2));
      }),
      description: 'Increase your MC production 2 steps.',
    };
}
