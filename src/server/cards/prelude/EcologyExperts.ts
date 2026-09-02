import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
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
        description: 'Increase your plant production 1 step. PLAY A CARD FROM HAND, IGNORING GLOBAL REQUIREMENTS.',
      },
    });
  }
  public override getGlobalParameterRequirementBonus(player: IPlayer): number {
    if (player.lastCardPlayed === this.name) {
      // Magic number high enough to always ignore requirements.
      return 50;
    }
    return 0;
  }

  public override canPlay(player: IPlayer) {
    // NOTE: If the player has production-based benefits from this prelude (like )
    player.temporaryGlobalParameterRequirementBonus += 50;
    player.production.plants++;
    if (player.playedCards.has(CardName.MANUTECH)) {
      player.plants++;
    }
    try {
      return player.getPlayableCards().length > 0;
    } finally {
      player.temporaryGlobalParameterRequirementBonus -= 50;
      player.production.plants--;
      if (player.playedCards.has(CardName.MANUTECH)) {
        player.plants--;
      }
    }
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new PlayProjectCard(player));
    return undefined;
  }
}
