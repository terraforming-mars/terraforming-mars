import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class LunaProjectOffice extends Card implements IProjectCard {
  // TODO(kberg): don't use resource count as this card is not meant for working with CEO's Favorite Project.
  constructor() {
    super({
      name: CardName.LUNA_PROJECT_OFFICE,
      cardType: CardType.AUTOMATED,
      tags: [Tags.SCIENCE],
      cost: 4,
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),

      metadata: {
        description: 'Requires 2 science tags.',
        cardNumber: 'M20',
        renderData: CardRenderer.builder((b) => {
          b.text('DRAW 5 CARDS DURING THE RESEARCH PHASE FOR THE NEXT 2 GENERATIONS.', CardRenderItemSize.MEDIUM, true);
        }),
      },
    });
  };
  public resourceCount = 0;

  public static consume(player: Player): boolean {
    return MoonExpansion.ifElseMoon(player.game, () => {
      const card = player.playedCards.find((card) => card.name === CardName.LUNA_PROJECT_OFFICE);
      if (card !== undefined) {
        const lunaProjectOffice = card as LunaProjectOffice;
        if (lunaProjectOffice.resourceCount > 0) {
          lunaProjectOffice.resourceCount--;
          return true;
        }
      }
      return false;
    }, () => false);
  }

  public play() {
    this.resourceCount = 2;
    return undefined;
  }
}
