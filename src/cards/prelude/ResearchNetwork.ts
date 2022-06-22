import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class ResearchNetwork extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.RESEARCH_NETWORK,
      tags: [Tags.WILD],
      productionBox: Units.of({megacredits: 1}),

      metadata: {
        cardNumber: 'P28',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).br;
          b.cards(3);
        }),
        description: 'Increase your M€ production 1 step. Draw 3 cards. After being played, when you perform an action, the wild tag counts as any tag of your choice.',
      },
    });
  }
  public play(player: Player) {
    player.adjustProduction(this.productionBox),
    player.drawCard(3);
    return undefined;
  }
}
