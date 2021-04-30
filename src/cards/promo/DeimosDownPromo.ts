import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../TileType';
import {ISpace} from '../../boards/ISpace';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST, MAX_TEMPERATURE} from '../../constants';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRenderer} from '../render/CardRenderer';

export class DeimosDownPromo extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.DEIMOS_DOWN_PROMO,
      tags: [Tags.SPACE],
      cost: 31,

      metadata: {
        cardNumber: 'X31',
        description: 'Raise temperature 3 steps and gain 4 steel. Place this tile ADJACENT TO no other city tile. Remove up to 6 Plants from any player.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(3).br;
          b.tile(TileType.DEIMOS_DOWN, true).asterix().br;
          b.steel(4).digit.nbsp.minus().plants(-6).any;
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    const canPlaceTile = player.game.board.getAvailableSpacesForCity(player).length > 0;
    const remainingTemperatureSteps = (MAX_TEMPERATURE - player.game.getTemperature()) / 2;
    const stepsRaised = Math.min(remainingTemperatureSteps, 3);

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST * stepsRaised, {titanium: true}) && canPlaceTile;
    }

    return canPlaceTile;
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 3);
    player.game.defer(new RemoveAnyPlants(player, 6));
    player.steel += 4;

    const availableSpaces = player.game.board.getAvailableSpacesForCity(player);

    return new SelectSpace('Select space for tile', availableSpaces, (foundSpace: ISpace) => {
      player.game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.DEIMOS_DOWN});
      return undefined;
    });
  }
}
