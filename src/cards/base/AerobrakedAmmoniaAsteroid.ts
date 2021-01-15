import {ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {Resources} from '../../Resources';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {CardRenderer} from '../render/CardRenderer';

export class AerobrakedAmmoniaAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.AEROBRAKED_AMMONIA_ASTEROID,
      tags: [Tags.SPACE],
      cost: 26,

      metadata: {
        description: 'Increase your heat production 3 steps and your Plant productions 1 step. Add 2 Microbes to ANOTHER card.',
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
    const cardsToPick = player.getResourceCards(ResourceType.MICROBE);
    player.addProduction(Resources.HEAT, 3);
    player.addProduction(Resources.PLANTS);

    if (cardsToPick.length < 1) return undefined;

    if (cardsToPick.length === 1) {
      player.addResourceTo(cardsToPick[0], 2);
      LogHelper.logAddResource(player, cardsToPick[0], 2);
      return undefined;
    }

    return new SelectCard('Select card to add 2 microbes', 'Add microbes', cardsToPick, (foundCards: Array<ICard>) => {
      player.addResourceTo(foundCards[0], 2);
      LogHelper.logAddResource(player, foundCards[0], 2);
      return undefined;
    });
  }
}
