import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {MAX_OCEAN_TILES, MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';

export class GiantIceAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.GIANT_ICE_ASTEROID,
      tags: [Tags.SPACE],
      cost: 36,

      metadata: {
        description: 'Raise temperature 2 steps and place 2 ocean tiles. Remove up to 6 plants from any player.',
        cardNumber: '080',
        renderData: CardRenderer.builder((b) => {
          b.temperature(2).br;
          b.oceans(2).br;
          b.minus().plants(-6).any;
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    const remainingOceans = MAX_OCEAN_TILES - player.game.board.getOceansOnBoard();
    const remainingTemperatureSteps = (MAX_TEMPERATURE - player.game.getTemperature()) / 2;
    const stepsRaised = Math.min(remainingTemperatureSteps, 2) + Math.min(remainingOceans, 2);

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST * stepsRaised, {titanium: true});
    }

    return true;
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 2);
    player.game.defer(new PlaceOceanTile(player, 'Select space for first ocean'));
    player.game.defer(new PlaceOceanTile(player, 'Select space for second ocean'));
    player.game.defer(new RemoveAnyPlants(player, 6));
    return undefined;
  }
}
