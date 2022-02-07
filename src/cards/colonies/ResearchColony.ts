import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class ResearchColony extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 20,
      tags: [Tags.SPACE, Tags.SCIENCE],
      name: CardName.RESEARCH_COLONY,
      cardType: CardType.AUTOMATED,

      metadata: {
        cardNumber: 'C34',
        renderData: CardRenderer.builder((b) => {
          b.colonies(1).asterix().nbsp.cards(2);
        }),
        description: 'Place a colony. MAY BE PLACED WHERE YOU ALREADY HAVE A COLONY. Draw 2 cards.',
      },
    });
  }

  public play(player: Player) {
    player.game.defer(new BuildColony(player, true, 'Select colony for Research Colony'));
    player.drawCard(2);
    return undefined;
  }
}
