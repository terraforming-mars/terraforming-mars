import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class AerobrakedAmmoniaAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.AEROBRAKED_AMMONIA_ASTEROID,
      tags: [Tag.SPACE],
      cost: 26,
      productionBox: {heat: 3, plants: 1},

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

  public override bespokePlay(player: Player) {
    const cardsToPick = player.getResourceCards(CardResource.MICROBE);

    if (cardsToPick.length < 1) return undefined;

    if (cardsToPick.length === 1) {
      player.addResourceTo(cardsToPick[0], {qty: 2, log: true});
      return undefined;
    }

    return new SelectCard('Select card to add 2 microbes', 'Add microbes', cardsToPick, ([card]) => {
      player.addResourceTo(card, {qty: 2, log: true});
      return undefined;
    });
  }
}
