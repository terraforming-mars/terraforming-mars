import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {Size} from '../render/Size';

export class LunaProjectOffice extends Card implements IProjectCard {
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
          b.text('DRAW 5 CARDS DURING THE RESEARCH PHASE FOR THE NEXT 2 GENERATIONS.', Size.MEDIUM, true);
        }),
      },
    });
  };

  public play(player: Player) {
    MoonExpansion.moonData(player.game).lunaProjectOfficeLastGeneration = player.game.generation + 2;
    return undefined;
  }

  // Returns true when the current player has played Luna Project Office and the card is still valid
  public static isActive(player: Player): boolean {
    return MoonExpansion.ifElseMoon(player.game, (moonData) => {
      if (!player.playedCards.some((card) => card.name === CardName.LUNA_PROJECT_OFFICE)) {
        return false;
      }
      return player.game.generation <= (moonData.lunaProjectOfficeLastGeneration ?? -1);
    }, () => false);
  }
}
