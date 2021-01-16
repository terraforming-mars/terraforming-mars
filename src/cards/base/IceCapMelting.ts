import {Card} from '../Card';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class IceCapMelting extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.ICE_CAP_MELTING,
      cost: 5,

      metadata: {
        cardNumber: '181',
        requirements: CardRequirements.builder((b) => b.temperature(2)),
        renderData: CardRenderer.builder((b) => b.oceans(1)),
        description: 'Requires +2 C or warmer. Place 1 ocean tile.',
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    const meetsTemperatureRequirements = game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, 2);
    const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oceansMaxed) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST) && meetsTemperatureRequirements;
    }

    return meetsTemperatureRequirements;
  }
  public play(player: Player, game: Game) {
    game.defer(new PlaceOceanTile(player));
    return undefined;
  }
}
