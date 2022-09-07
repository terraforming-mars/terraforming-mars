import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {PlayProjectCard} from '../../deferredActions/PlayProjectCard';
import {CardRenderer} from '../render/CardRenderer';

export class EcologyExperts extends PreludeCard {
  constructor() {
    super({
      name: CardName.ECOLOGY_EXPERTS,
      tags: [Tag.PLANT, Tag.MICROBE],

      behavior: {
        production: {plants: 1},
      },

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
  public override bespokePlay(player: Player) {
    player.game.defer(new PlayProjectCard(player));
    return undefined;
  }
}
