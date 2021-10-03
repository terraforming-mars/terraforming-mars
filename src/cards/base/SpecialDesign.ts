import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SpecialDesign extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.SPECIAL_DESIGN,
      tags: [Tags.SCIENCE],
      cost: 4,

      metadata: {
        cardNumber: '206',
        renderData: CardRenderer.builder((b) => {
          b.plate('Global requirements').colon().text('+/- 2');
        }),
        description: 'The next card you play this generation is +2 or -2 steps in global requirements, your choice.',
      },
    });
  }
  public getRequirementBonus(player: Player): number {
    if (player.lastCardPlayed === this.name) {
      return 2;
    }
    return 0;
  }
  public play() {
    return undefined;
  }
}
