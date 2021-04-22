import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class OrbitalReflectors extends Card {
  constructor() {
    super({
      name: CardName.ORBITAL_REFLECTORS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.VENUS, Tags.SPACE],
      cost: 26,

      metadata: {
        cardNumber: '242',
        renderData: CardRenderer.builder((b) => {
          b.venus(2).br;
          b.production((pb) => {
            pb.heat(2);
          });
        }),
        description: 'Raise Venus 2 steps. Increase your heat production 2 steps.',
      },
    });
  };

  public canPlay(player: Player): boolean {
    const remainingVenusSteps = (MAX_VENUS_SCALE - player.game.getVenusScaleLevel()) / 2;
    const stepsRaised = Math.min(remainingVenusSteps, 2);

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST * stepsRaised, {titanium: true, floaters: true});
    }

    return true;
  }

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 2);
    player.addProduction(Resources.HEAT, 2);
    return undefined;
  }
}
