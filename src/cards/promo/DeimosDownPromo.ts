import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../TileType';
import {ISpace} from '../../boards/ISpace';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST, MAX_TEMPERATURE} from '../../constants';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class DeimosDownPromo implements IProjectCard {
    public cost = 31;
    public tags = [Tags.SPACE];
    public name = CardName.DEIMOS_DOWN_PROMO;
    public cardType = CardType.EVENT;

    public canPlay(player: Player, game: Game): boolean {
      const canPlaceTile = game.board.getAvailableSpacesForCity(player).length > 0;
      const remainingTemperatureSteps = (MAX_TEMPERATURE - game.getTemperature()) / 2;
      const stepsRaised = Math.min(remainingTemperatureSteps, 3);

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * stepsRaised, game, false, true) && canPlaceTile;
      }

      return canPlaceTile;
    }

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 3);
      game.defer(new RemoveAnyPlants(player, 6));
      player.steel += 4;

      const availableSpaces = game.board.getAvailableSpacesForCity(player);

      return new SelectSpace('Select space for tile', availableSpaces, (foundSpace: ISpace) => {
        game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.DEIMOS_DOWN});
        return undefined;
      });
    }
    public metadata: CardMetadata = {
      cardNumber: '039',
      description: 'Raise temperature 3 steps and gain 4 steel. Place this tile ADJACENT TO no other city tile. Remove up to 6 Plants from any player.',
      renderData: CardRenderer.builder((b) => {
        b.temperature(3).br;
        b.tile(TileType.DEIMOS_DOWN, true).asterix().br;
        b.steel(4).digit.nbsp.minus().plants(-6).any;
      }),
    }
}
