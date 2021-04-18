import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class ConvoyFromEuropa extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.CONVOY_FROM_EUROPA,
      tags: [Tags.SPACE],
      cost: 15,

      metadata: {
        cardNumber: '161',
        description: 'Place 1 ocean tile and draw 1 card.',
        renderData: CardRenderer.builder((b) => b.oceans(1).cards(1)),
      },
    });
  }

  public canPlay(player: Player): boolean {
    const oceansMaxed = player.game.board.getOceansOnBoard() === MAX_OCEAN_TILES;

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && !oceansMaxed) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST, {titanium: true});
    }

    return true;
  }

  public play(player: Player) {
    player.drawCard();
    player.game.defer(new PlaceOceanTile(player));
    return undefined;
  }
}
