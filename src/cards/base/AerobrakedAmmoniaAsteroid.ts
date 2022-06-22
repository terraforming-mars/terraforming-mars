import {ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {Resources} from '../../common/Resources';
import {CardResource} from '../../common/CardResource';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class AerobrakedAmmoniaAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.AEROBRAKED_AMMONIA_ASTEROID,
      tags: [Tags.SPACE],
      cost: 26,

      metadata: {
        description: 'Increase your heat production 3 steps and your plant production 1 step. Add 2 Microbes to ANOTHER card.',
        cardNumber: '170',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.heat(3).br;
            pb.plants(1);
          }).br;
          b.microbes(2).asterix();
        }),
      },
    });
  }

  public play(player: Player) {
    const cardsToPick = player.getResourceCards(CardResource.MICROBE);
    player.addProduction(Resources.HEAT, 3);
    player.addProduction(Resources.PLANTS, 1);

    if (cardsToPick.length < 1) return undefined;

    if (cardsToPick.length === 1) {
      player.addResourceTo(cardsToPick[0], {qty: 2, log: true});
      return undefined;
    }

    return new SelectCard('Select card to add 2 microbes', 'Add microbes', cardsToPick, (foundCards: Array<ICard>) => {
      player.addResourceTo(foundCards[0], {qty: 2, log: true});
      return undefined;
    });
  }
}
