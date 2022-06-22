import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../../common/cards/Tags';
import {Resources} from '../../common/Resources';
import {CardResource} from '../../common/CardResource';
import {all} from '../Options';
import {ICard} from '../ICard';
import {SelectCard} from '../../inputs/SelectCard';

export class CassiniStation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CASSINI_STATION,
      cost: 23,
      tags: [Tags.ENERGY, Tags.SCIENCE, Tags.SPACE],

      metadata: {
        cardNumber: 'Pf62',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1).slash().colonies(1, {all})).br;
          b.floaters(2).or().data({amount: 3});
        }),
        description: 'Increase your energy production 1 step for every colony in play. ' +
          'Add 2 floaters on any card OR add 3 data on any card.',
      },
    });
  }

  public play(player: Player) {
    let coloniesCount: number = 0;
    player.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.length;
    });

    player.addProduction(Resources.ENERGY, coloniesCount, {log: true});

    const cards = [
      ...player.getResourceCards(CardResource.FLOATER),
      ...player.getResourceCards(CardResource.DATA),
    ];

    if (cards.length === 0) {
      return undefined;
    }
    const input = new SelectCard(
      'Select card to gain 2 floaters or 3 data',
      'Add resources',
      cards,
      (selected: Array<ICard>) => {
        const card = selected[0];
        if (card.resourceType === CardResource.FLOATER) {
          player.addResourceTo(card, {qty: 2, log: true});
        } else {
          player.addResourceTo(card, {qty: 3, log: true});
        }
        return undefined;
      },
    );

    if (cards.length === 1) {
      input.cb(cards);
      return undefined;
    }
    return input;
  }
}
