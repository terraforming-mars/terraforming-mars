import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Card} from '../Card';

export class LunaProjectOffice extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNA_PROJECT_OFFICE,
      cardType: CardType.AUTOMATED,
      tags: [Tags.SCIENCE],
      cost: 4,

      metadata: {
        description: 'Requires 2 science tags. / DRAW 5 CARDS DURING THE RESEARCH PHASE FOR THE NEXT 2 GENERATIONS.',
        cardNumber: 'M20',
        renderData: CardRenderer.builder((_b) => {}),
      },
    });
  };
  public resourceCount = 0;

  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 2;
  }

  public static consume(player: Player): boolean {
    return MoonExpansion.ifMoon(player.game, () => {
      const card = player.playedCards.find((card) => card.name === CardName.LUNA_PROJECT_OFFICE);
      if (card !== undefined) {
        const lunaProjectOffice = card as LunaProjectOffice;
        if (lunaProjectOffice.resourceCount > 0) {
          lunaProjectOffice.resourceCount--;
          return true;
        }
      }
      return false;
    }) || false;
  }

  public play(_player: Player) {
    this.resourceCount = 2;
    return undefined;
  }
}
