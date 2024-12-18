import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Turmoil} from '../../turmoil/Turmoil';
import {Resource} from '../../../common/Resource';
import {IPlayer} from '../../IPlayer';
import {isSpecialTileSpace, Board} from '../../boards/Board';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';

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

  public resolve(game: IGame, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      const specialTileCount = this.specialTileCount(player);
      const bonus = Math.min(specialTileCount, 5);
      player.production.add(Resource.MEGACREDITS, bonus, {log: true, from: this.name});
      player.stock.add(Resource.ENERGY, turmoil.getPlayerInfluence(player), {log: true, from: this.name});
    });
  }

  private specialTileCount(player: IPlayer) {
    // This code is repeated in Land Specialist
    const spaces = player.game.board.spaces
      .filter(Board.ownedBy(player))
      .filter(isSpecialTileSpace);

    const marsCount = spaces.length;
    const moonCount = MoonExpansion.ifElseMoon(player.game, (moonData) => {
      return moonData.moon.spaces
        .filter(Board.ownedBy(player))
        .filter(isSpecialTileSpace)
        .length;
    },
    () => 0);
    return marsCount + moonCount;
  }
}
