import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
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

  public canPlay(player: Player): boolean {
    const remainingOceans = MAX_OCEAN_TILES - player.game.board.getOceansOnBoard();
    const oceansPlaced = Math.min(remainingOceans, 2);

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST * oceansPlaced, {titanium: true});
    }

    return true;
  }

  public play(player: Player) {
    player.game.defer(new PlaceOceanTile(player, 'Select space for first ocean'));
    player.game.defer(new PlaceOceanTile(player, 'Select space for second ocean'));
    return undefined;
  }
}
