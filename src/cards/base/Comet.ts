import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_TEMPERATURE, MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';

export class Comet extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.COMET,
      tags: [Tags.SPACE],
      cost: 21,

      metadata: {
        cardNumber: '010',
        description: 'Raise temperature 1 step and place an ocean tile. Remove up to 3 Plants from any player.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(1).oceans(1).br;
          b.minus().plants(-3).any;
        }),
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    const temperatureStep = game.getTemperature() < MAX_TEMPERATURE ? 1 : 0;
    const oceanStep = game.board.getOceansOnBoard() < MAX_OCEAN_TILES ? 1 : 0;
    const totalSteps = temperatureStep + oceanStep;

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * totalSteps, game, false, true);
    }

    return true;
  }

  public play(player: Player, game: Game) {
    game.increaseTemperature(player, 1);
    game.defer(new PlaceOceanTile(player));
    game.defer(new RemoveAnyPlants(player, 3));
    return undefined;
  }
}
