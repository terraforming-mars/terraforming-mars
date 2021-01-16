import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class LakeMarineris extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.LAKE_MARINERIS,
      cost: 18,

      metadata: {
        cardNumber: '053',
        requirements: CardRequirements.builder((b) => b.temperature(0)),
        renderData: CardRenderer.builder((b) => b.oceans(2)),
        description: 'Requires 0° C or warmer. Place 2 ocean tiles.',
        victoryPoints: 2,
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    const meetsTemperatureRequirements = super.canPlay(player);
    const remainingOceans = MAX_OCEAN_TILES - game.board.getOceansOnBoard();
    const oceansPlaced = Math.min(remainingOceans, 2);

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * oceansPlaced) && meetsTemperatureRequirements;
    }

    return meetsTemperatureRequirements;
  }

  public play(player: Player, game: Game) {
    game.defer(new PlaceOceanTile(player, 'Select space for first ocean'));
    game.defer(new PlaceOceanTile(player, 'Select space for second ocean'));
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }
}
