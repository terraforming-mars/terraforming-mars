import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {undergroundShelters} from '../render/DynamicVictoryPoints';
import {IPlayer} from '../../IPlayer';
import {IActionCard} from '../ICard';
import {SelectClaimedUndergroundToken} from '../../inputs/SelectClaimedUndergroundToken';

export class UndergroundShelters extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.UNDERGROUND_SHELTERS,
      cost: 14,
      tags: [Tag.BUILDING],
      victoryPoints: 'special',

      behavior: {
        underworld: {excavate: 1},
      },

      metadata: {
        cardNumber: 'U072',
        // TODO(kberg): Custom VP icon.
        victoryPoints: undergroundShelters(),
        renderData: CardRenderer.builder((b) => {
          b.action(
            'Place your player cube on one of your claimed underground resource tokens without a cube on it.',
            (ab) => ab.empty().startAction.undergroundShelters()).br;
          b.vpText('1 VP per underground resource token with a cube on it.').br;
          b.excavate(1).br;
        }),
        description: 'Excavate an underground resource.',
      },
    });
  }

  private availableTokens(player: IPlayer) {
    return player.underworldData.tokens.filter((t) => !t.shelter);
  }

  public canAct(player: IPlayer) {
    return this.availableTokens(player).length > 0;
  }

  public action(player: IPlayer) {
    const tokens = this.availableTokens(player);
    return new SelectClaimedUndergroundToken(tokens, 1)
      .andThen(([index]) => {
        tokens[index].shelter = true;
        return undefined;
      });
  }

  public override getVictoryPoints(player: IPlayer): number {
    return player.underworldData.tokens.filter((t) => t.shelter).length;
  }
}
