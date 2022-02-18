import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardRenderer} from '../render/CardRenderer';
import {ICard} from '../ICard';
import {ResourceType} from '../../common/ResourceType';

export class TopsoilContract extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.TOPSOIL_CONTRACT,
      tags: [Tags.MICROBE, Tags.EARTH],
      cost: 8,

      metadata: {
        cardNumber: 'X30',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you gain a microbe to ANY CARD, also gain 1 M€.', (eb) => {
            eb.microbes(1).asterix().startEffect.megacredits(1);
          }).br;
          b.plants(3);
        }),
        description: 'Gain 3 plants.',
      },
    });
  }

  public play(player: Player) {
    player.plants += 3;
    return undefined;
  }

  public onResourceAdded(player: Player, card: ICard, count: number) {
    if (card.resourceType === ResourceType.MICROBE) {
      player.megaCredits += count;
    }
  }
}
