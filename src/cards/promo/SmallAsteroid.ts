import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST, MAX_TEMPERATURE} from '../../constants';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';

export class SmallAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.SMALL_ASTEROID,
      tags: [Tags.SPACE],
      cost: 10,

      metadata: {
        cardNumber: '209',
        renderData: CardRenderer.builder((b) => {
          b.temperature(1).br;
          b.minus().plants(2).any;
        }),
        description: 'Increase temperature 1 step. Remove up to 2 plants from any player.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    const canRaiseTemperature = player.game.getTemperature() < MAX_TEMPERATURE;
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && canRaiseTemperature) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST, {titanium: true});
    }

    return true;
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 1);
    player.game.defer(new RemoveAnyPlants(player, 2));
    return undefined;
  }
}
