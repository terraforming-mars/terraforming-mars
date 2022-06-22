import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {Resources} from '../../common/Resources';
import {Player} from '../../Player';
import {isSpecialTile, playerTileFn} from '../../boards/Board';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.production((pb) => pb.megacredits(1)).slash().specialTile().nbsp;
  b.energy(1).slash().influence();
});

export class SpaceRaceToMars extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.SPACE_RACE_TO_MARS,
      description: 'Increase your M€ production 1 step for every special tile you own (max 5.) Gain 1 energy for every influence you have',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.MARS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
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
}
