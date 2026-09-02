import {expect} from 'chai';
import {VenusAllies} from '../../../src/server/cards/prelude2/VenusAllies';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {Luna} from '../../../src/server/colonies/Luna';
import {Pluto} from '../../../src/server/colonies/Pluto';

describe('VenusAllies', () => {
  let card: VenusAllies;
  let player: TestPlayer;
  let game: IGame;
  beforeEach(() => {
    card = new VenusAllies();
    [game, player] = testGame(1, {venusNextExtension: true});
  });

  it('Megacredits check', () => {
    const colony1 = new Luna();
    const colony2 = new Pluto();
    colony1.colonies.push(player.id);
    game.colonies.push(colony1);
    colony2.colonies.push(player.id);
    game.colonies.push(colony2);
    card.play(player);
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(player.megaCredits).eq(8);
  });
});
