import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {PartyName} from '../../common/turmoil/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class SupportedResearch extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 3,
      tags: [Tags.SCIENCE],
      name: CardName.SUPPORTED_RESEARCH,
      cardType: CardType.AUTOMATED,

      requirements: CardRequirements.builder((b) => b.party(PartyName.SCIENTISTS)),
      metadata: {
        cardNumber: 'T14',
        renderData: CardRenderer.builder((b) => {
          b.cards(2);
        }),
        description: 'Requires that Scientists are ruling or that you have 2 delegates there. Draw 2 cards.',
      },
    });
  }

  public play(player: Player) {
    player.drawCard(2);
    return undefined;
  }
}
