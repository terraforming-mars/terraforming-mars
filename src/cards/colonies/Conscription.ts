import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Conscription extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      cost: 5,
      tags: [Tags.EARTH],
      name: CardName.CONSCRIPTION,

      requirements: CardRequirements.builder((b) => b.tag(Tags.EARTH, 2)),
      metadata: {
        cardNumber: 'C05',
        renderData: CardRenderer.builder((b) => {
          b.text('next card', CardRenderItemSize.SMALL, true).colon().megacredits(-16);
        }),
        description: 'Requires 2 Earth tags. The next card you play this generation costs 16 MC less.',
        victoryPoints: -1,
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.EARTH) >= 2;
  }

  public getCardDiscount(player: Player) {
    if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === this.name) {
      return 16;
    }
    return 0;
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return -1;
  }
}
