import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';

export class PriceWars extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.PRICE_WARS,
      type: CardType.EVENT,
      cost: 6,
      tags: [Tag.BUILDING],

      requirements: {corruption: 2},
      victoryPoints: -1,

      behavior: {
        underworld: {markThisGeneration: {}},
      },

      metadata: {
        cardNumber: 'U63',
        renderData: CardRenderer.builder((b) => {
          b.minus().production((pb) => pb.heat(1)).br;
          b.megacredits(12).asterix().corruption(1).asterix();
        }),
        description: 'Requires 2 corruption. Until the end of this generation, ' +
          'your steel and titanium are worth 1 more M€ each, ' +
          'and steel and titanium for other players is worth 1 M€ less.',
      },
    });
  }

  public generationUsed: number = -1;

  // TODO(kberg): Make Astra Mechanica, Odyssey and Playwrights compatible.
  // TODO(kberg): log, log, log.
  public override bespokePlay(player: IPlayer) {
    player.increaseSteelValue();
    player.increaseTitaniumValue();
    for (const p of player.game.getPlayersInGenerationOrder()) {
      if (p !== player) {
        p.decreaseSteelValue();
        p.decreaseTitaniumValue();
      }
    }
    return undefined;
  }

  public onProductionPhase(player: IPlayer) {
    if (this.generationUsed === player.game.generation) {
      player.decreaseSteelValue();
      player.decreaseTitaniumValue();
      for (const p of player.game.getPlayersInGenerationOrder()) {
        if (p !== player) {
          p.increaseSteelValue();
          p.increaseTitaniumValue();
        }
      }
    }
    return undefined;
  }
}
