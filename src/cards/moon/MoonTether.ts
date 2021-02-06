import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class MoonTether extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MOON_TETHER,
      cardType: CardType.ACTIVE,
      tags: [Tags.MOON, Tags.SPACE],
      cost: 18,
      requirements: CardRequirements.builder((b) => b.tag(Tags.SPACE, 6)),

      metadata: {
        cardNumber: 'M90',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a card, you pay 2 MC less for it.', (eb) => {
            eb.empty().startEffect.megacredits(-2);
          }).br;
        }),
        description: 'Requires 6 Space tags.',
        victoryPoints: 1,
      },
    });
  };

  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SPACE) >= 6;
  }

  public play() {
    return undefined;
  }

  public getCardDiscount() {
    return 2;
  }

  public getVictoryPoints() {
    return 1;
  }
}
