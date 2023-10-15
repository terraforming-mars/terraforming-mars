import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';

export class LunaProjectOffice extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNA_PROJECT_OFFICE,
      type: CardType.AUTOMATED,
      tags: [Tag.SCIENCE],
      cost: 4,
      requirements: {tag: Tag.SCIENCE, count: 2},

      metadata: {
        description: 'Requires 2 science tags.',
        cardNumber: 'M20',
        renderData: CardRenderer.builder((b) => {
          b.text('DRAW 5 CARDS DURING THE RESEARCH PHASE FOR THE NEXT 2 GENERATIONS.', Size.MEDIUM, true);
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    MoonExpansion.moonData(player.game).lunaProjectOfficeLastGeneration = player.game.generation + 2;
    return undefined;
  }

  // Returns true when the current player has played Luna Project Office and the card is still valid
  public static isActive(player: IPlayer): boolean {
    return MoonExpansion.ifElseMoon(player.game, (moonData) => {
      if (!player.cardIsInEffect(CardName.LUNA_PROJECT_OFFICE)) {
        return false;
      }
      return player.game.generation <= (moonData.lunaProjectOfficeLastGeneration ?? -1);
    }, () => false);
  }
}
