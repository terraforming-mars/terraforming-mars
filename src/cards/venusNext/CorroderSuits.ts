import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class CorroderSuits extends Card {
  constructor() {
    super({
      name: CardName.CORRODER_SUITS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.VENUS],
      cost: 8,

      metadata: {
        cardNumber: '219',
        description: 'Increase your M€ production 2 steps. Add 1 resource to ANY Venus CARD.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(2);
          }).wild(1, {secondaryTag: Tags.VENUS});
        }),
      },
    });
  };

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 2);
    const cards = CorroderSuits.getVenusResCards(player);

    if (cards.length === 0) return undefined;

    if (cards.length === 1) {
      player.addResourceTo(cards[0], {log: true});
      return undefined;
    }

    return new SelectCard(
      'Select card to add 1 resource',
      'Add resource',
      CorroderSuits.getVenusResCards(player),
      (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0], {log: true});
        return undefined;
      },
    );
  }
  public static getVenusResCards(player: Player): ICard[] {
    return player.getResourceCards().filter((card) => card.tags.includes(Tags.VENUS));
  }
}
