import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {PartyName} from '../../turmoil/parties/PartyName';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {CardRequirements} from '../CardRequirements';

export class LunaConference implements IProjectCard {
  public cost = 5;
  public tags = [Tags.SCIENCE, Tags.MOON, Tags.EVENT];
  public cardType = CardType.EVENT;
  public name = CardName.LUNA_CONFERENCE;

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

  public readonly metadata: CardMetadata = {
    description: 'Requires that Scientists are ruling or that you have 2 delegates there. ' +
      'Gain 2 MC per road tile on the Moon. Gain 2MC per colony tile on the Moon.',
    cardNumber: 'M58',
    requirements: CardRequirements.builder((b) => b.party(PartyName.SCIENTISTS)),
    renderData: CardRenderer.builder((b) => {
      b.megacredits(2).slash().tile(TileType.MOON_ROAD, false).br;
      b.megacredits(2).slash().tile(TileType.MOON_COLONY, false).asterix().br;
    }),
  };
}
