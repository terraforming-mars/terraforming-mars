import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class IceAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.ICE_ASTEROID,
      tags: [Tags.SPACE],
      cost: 23,

      metadata: {
        cardNumber: '078',
        renderData: CardRenderer.builder((b) => b.oceans(2)),
        description: 'Place 2 ocean tiles.',
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    const remainingOceans = MAX_OCEAN_TILES - game.board.getOceansOnBoard();
    const oceansPlaced = Math.min(remainingOceans, 2);

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * oceansPlaced, game, false, true);
    }

    return true;
  }

  public play(player: Player, game: Game) {
    game.defer(new PlaceOceanTile(player, 'Select space for first ocean'));
    game.defer(new PlaceOceanTile(player, 'Select space for second ocean'));
    return undefined;
  }
}
