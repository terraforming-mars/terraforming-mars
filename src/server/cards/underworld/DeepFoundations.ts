import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Tag} from '@/common/cards/Tag';
import {IPlayer} from '@/server/IPlayer';
import {SelectSpace} from '@/server/inputs/SelectSpace';
import {UnderworldExpansion} from '@/server/underworld/UnderworldExpansion';
import {Card} from '@/server/cards/Card';
import {IActionCard} from '@/server/cards/ICard';
import {CardType} from '@/common/cards/CardType';
import {SelectPaymentDeferred} from '@/server/deferredActions/SelectPaymentDeferred';

export class DeepFoundations extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.DEEP_FOUNDATIONS,
      type: CardType.ACTIVE,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 4,

      metadata: {
        cardNumber: 'U100',
        renderData: CardRenderer.builder((b) => {
          b.action('Pay 20 M€ (STEEL MAY BE USED). Pick a valid space for a city on Mars. ' +
            'Excavate the underground resource in that space, if possible. Then place a city there.',
          (ab) => ab.megacredits(20).super((sb) => sb.steel(1)).startAction.excavate(1).asterix().city());
        }),
      },
    });
  }

  public getCandidateSpaces(player: IPlayer) {
    return player.game.board.getAvailableSpacesForCity(player);
  }

  public canAct(player: IPlayer): boolean {
    return player.canAfford({cost: 20, steel: true}) && this.getCandidateSpaces(player).length > 0;
  }

  public action(player: IPlayer) {
    const availableSpaces = this.getCandidateSpaces(player);
    if (availableSpaces.length === 0) {
      return undefined;
    }

    player.game.defer(new SelectPaymentDeferred(
      player, 20, {
        canUseSteel: true,
        title: 'Spend 20 M€ for to excavate a space and place a city',
      })
      .andThen(() => {
        player.defer(new SelectSpace('Select space for city', availableSpaces).andThen((space) => {
          if (UnderworldExpansion.excavatableSpaces(player, {ignorePlacementRestrictions: true}).includes(space)) {
            UnderworldExpansion.excavate(player, space);
          }
          player.game.addCity(player, space, this.name);
          return undefined;
        }));
        return undefined;
      }));
    return undefined;
  }
}

