import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {PlayProjectCard} from '../../deferredActions/PlayProjectCard';
import {CardRenderer} from '../render/CardRenderer';

export class EcologyExperts extends PreludeCard {
  constructor() {
    super({
      name: CardName.ECOLOGY_EXPERTS,
      tags: [Tags.PLANT, Tags.MICROBE],

      metadata: {
        cardNumber: 'P10',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).br.br;
          b.projectRequirements();
        }),
        description: 'Increase your plant production 1 step. Play a card from hand, ignoring global requirements.',
      },
    });
  }
  public getRequirementBonus(player: Player): number {
    if (player.lastCardPlayed === this.name) {
      // Magic number high enough to always ignore requirements.
      return 50;
    }
    return 0;
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 1);
    player.game.defer(new PlayProjectCard(player));
    return undefined;
  }
}
