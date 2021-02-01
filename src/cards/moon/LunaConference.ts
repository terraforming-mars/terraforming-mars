import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {PartyName} from '../../turmoil/parties/PartyName';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class LunaConference extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNA_CONFERENCE,
      cardType: CardType.EVENT,
      tags: [Tags.SCIENCE, Tags.MOON, Tags.EVENT],
      cost: 5,
      requirements: CardRequirements.builder((b) => b.party(PartyName.SCIENTISTS)),

      metadata: {
        description: 'Requires that Scientists are ruling or that you have 2 delegates there. ' +
        'Gain 2 MC per road tile on the Moon. Gain 2MC per colony tile on the Moon.',
        cardNumber: 'M58',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(2).slash().tile(TileType.MOON_ROAD, false).br;
          b.megacredits(2).slash().tile(TileType.MOON_COLONY, false).asterix().br;
        }),
      },
    });
  };

  public canPlay(player: Player): boolean {
    if (player.game.turmoil === undefined) {
      return false;
    }
    if (!player.game.turmoil.canPlay(player, PartyName.SCIENTISTS)) {
      return false;
    }
    return true;
  }

  public play(player: Player) {
    const moonRoadCount = MoonExpansion.tiles(player.game, TileType.MOON_ROAD, true).length;
    const moonColonyCount = MoonExpansion.tiles(player.game, TileType.MOON_COLONY, true).length;
    player.megaCredits += (moonRoadCount + moonColonyCount) * 2;
    return undefined;
  }
}
