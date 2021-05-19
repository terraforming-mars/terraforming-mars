import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class CulturalMetropolis extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CULTURAL_METROPOLIS,
      tags: [Tags.CITY, Tags.BUILDING],
      cost: 20,
      productionBox: Units.of({energy: -1, megacredits: 3}),

      requirements: CardRequirements.builder((b) => b.party(PartyName.UNITY)),
      metadata: {
        cardNumber: 'T03',
        description: 'Requires that Unity is ruling or that you have 2 delegates there. Decrease your energy production 1 step and increase your M€ production 3 steps. Place a city tile. Place 2 delegates in 1 party.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).city().delegates(2);
        }),
      },
    });
  }

  public canPlay(player: Player): boolean {
    if ( ! super.canPlay(player)) {
      return false;
    }

    if (player.getProduction(Resources.ENERGY) < 1) {
      return false;
    }

    // This card requires player has 2 delegates available
    const turmoil = player.game.turmoil;
    if (turmoil !== undefined) {
      const hasEnoughDelegates = turmoil.getDelegatesInReserve(player.id) > 1 ||
        (turmoil.getDelegatesInReserve(player.id) === 1 && turmoil.lobby.has(player.id));
      return hasEnoughDelegates;
    }

    return false;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.MEGACREDITS, 3);
    player.game.defer(new PlaceCityTile(player));
    const title = 'Select where to send two delegates';

    if (player.game.turmoil!.getDelegatesInReserve(player.id) > 1) {
      player.game.defer(new SendDelegateToArea(player, title, {count: 2, source: 'reserve'}));
    } else if (player.game.turmoil!.getDelegatesInReserve(player.id) === 1 && player.game.turmoil!.lobby.has(player.id)) {
      player.game.defer(new SendDelegateToArea(player, title, {count: 2, source: 'lobby'}));
    }
    return undefined;
  }
}
