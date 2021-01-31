import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class SubterraneanReservoir extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.SUBTERRANEAN_RESERVOIR,
      cost: 11,

      metadata: {
        cardNumber: '127',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1);
        }),
        description: 'Place 1 ocean tile.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    const oceansMaxed = player.game.board.getOceansOnBoard() === MAX_OCEAN_TILES;

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && !oceansMaxed) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST);
    }

    return true;
  }

  public play(player: Player) {
    player.game.defer(new PlaceOceanTile(player));
    return undefined;
  }
}

