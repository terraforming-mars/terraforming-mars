import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {Resources} from '../../Resources';
import {Player} from '../../Player';
import {isSpecialTile, playerTileFn} from '../../boards/Board';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.production((pb) => pb.megacredits(1)).slash().specialTile().br;
  b.energy(1).slash().influence();
});

export class SpaceRaceToMars implements IGlobalEvent {
  public name = GlobalEventName.SPACE_RACE_TO_MARS;
  public description = 'Increase your MC production 1 step for every special tile you own (max 5.) Gain 1 energy for every influence you have';
  public revealedDelegate = PartyName.SCIENTISTS;
  public currentDelegate = PartyName.MARS;
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayers().forEach((player) => {
      const specialTileCount = this.specialTileCount(player);
      const bonus = Math.min(specialTileCount, 5);
      player.addProduction(Resources.MEGACREDITS, bonus, {log: true, from: this.name});
      player.addResource(Resources.ENERGY, turmoil.getPlayerInfluence(player), {log: true, from: this.name});
    });
  }

  private specialTileCount(player: Player) {
    // This code is repeated in Land Specialist
    const spaces = player.game.board.spaces
      .filter(playerTileFn(player))
      .filter(isSpecialTile);

    const marsCount = spaces.length;
    const moonCount = MoonExpansion.ifElseMoon(player.game, (moonData) => {
      return moonData.moon.spaces
        .filter(playerTileFn(player))
        .filter(isSpecialTile)
        .length;
    },
    () => 0);
    return marsCount + moonCount;
  }
  public renderData = RENDER_DATA;
}
