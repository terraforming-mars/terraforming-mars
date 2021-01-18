import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class DeepWellHeating extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.DEEP_WELL_HEATING,
      tags: [Tags.ENERGY, Tags.BUILDING],
      cost: 13,
      productionDelta: Units.of({energy: 1}),

      metadata: {
        cardNumber: '003',
        description: 'Increase your Energy production 1 step. Increase temperature 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).temperature(1);
        }),
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    const temperatureMaxed = game.getVenusScaleLevel() === MAX_TEMPERATURE;
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !temperatureMaxed) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, true);
    }

    return true;
  }

  public play(player: Player, game: Game) {
    player.addProduction(Resources.ENERGY);
    return game.increaseTemperature(player, 1);
  }
}
