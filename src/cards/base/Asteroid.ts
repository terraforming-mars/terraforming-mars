import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';

export class Asteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.ASTEROID,
      tags: [Tags.SPACE],
      cost: 14,

      metadata: {
        description: 'Raise temperature 1 step and gain 2 titanium. Remove up to 3 Plants from any player.',
        cardNumber: '009',
        renderData: CardRenderer.builder((b) => {
          b.temperature(1).br;
          b.titanium(2).br;
          b.minus().plants(-3).any;
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    const temperatureMaxed = player.game.getTemperature() === MAX_TEMPERATURE;
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && !temperatureMaxed) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST, {titanium: true});
    }

    return true;
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 1);
    player.game.defer(new RemoveAnyPlants(player, 3));
    player.titanium += 2;
    return undefined;
  }
}
