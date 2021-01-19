import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ResearchNetwork extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.RESEARCH_NETWORK,
      tags: [Tags.WILDCARD],

      metadata: {
        cardNumber: 'P28',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).br;
          b.cards(3);
        }),
        description: 'Increase your MC production 1 step. Draw 3 cards. After being played, when you perform an action, the wild tag counts as any tag of your choice.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS);
    player.drawCard(3);
    return undefined;
  }
}
