import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class IceMoonColony extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 23,
      tags: [Tags.SPACE],
      name: CardName.ICE_MOON_COLONY,
      cardType: CardType.AUTOMATED,

      metadata: {
        cardNumber: 'C15',
        renderData: CardRenderer.builder((b) => b.colonies(1).oceans(1)),
        description: 'Place 1 colony and 1 ocean tile.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    const oceansMaxed = player.game.board.getOceansOnBoard() === MAX_OCEAN_TILES;
    const hasAvailableColonyTile = player.hasAvailableColonyTileToBuildOn();
    const canPayForReds = player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST, {titanium: true});

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && !oceansMaxed) {
      return hasAvailableColonyTile && canPayForReds;
    }

    return hasAvailableColonyTile;
  }

  public play(player: Player) {
    player.game.defer(new BuildColony(player, false, 'Select colony for Ice Moon Colony'));
    player.game.defer(new PlaceOceanTile(player, 'Select ocean for Ice Moon Colony'));
    return undefined;
  }
}
