import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';

export class MartianSurvey extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.MARTIAN_SURVEY,
      tags: [Tags.SCIENCE],
      cost: 9,
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.oxygen(4, {max})),
      metadata: {
        cardNumber: 'P38',
        renderData: CardRenderer.builder((b) => {
          b.cards(2);
        }),
        description: 'Oxygen must be 4% or lower. Draw two cards.',
      },
    });
  }

  public play(player: Player) {
    player.drawCard(2);
    return undefined;
  }
}
