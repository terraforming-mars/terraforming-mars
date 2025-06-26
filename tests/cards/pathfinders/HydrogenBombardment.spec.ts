import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {HydrogenBombardment} from '../../../src/server/cards/pathfinders/HydrogenBombardment';
import {IGame} from '../../../src/server/IGame';
import {Units} from '../../../src/common/Units';
import {TestPlayer} from '../../TestPlayer';

describe('HydrogenBombardment', () => {
  let card: HydrogenBombardment;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new HydrogenBombardment();
    [game, player] = testGame(1, {venusNextExtension: true});
  });

  it('Should play', () => {
    card.play(player);
    expect(game.getVenusScaleLevel()).to.eq(2);
    expect(player.megaCredits).eq(6);
    expect(player.production.asUnits()).deep.eq(Units.of({titanium: 1}));
  });
});
