import {expect} from 'chai';
import {addCity, cast} from '../../TestingUtils';
import {AerosportTournament} from '../../../src/server/cards/venusNext/AerosportTournament';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';

describe('AerosportTournament', () => {
  let player: TestPlayer;
  let card: AerosportTournament;

  beforeEach(() => {
    [/* game */, player] = testGame(2);
    card = new AerosportTournament();
  });

  it('Can play', () => {
    const corp = new Celestic();
    const [/* game */, player] = testGame(2);
    player.corporations.push(corp);
    corp.resourceCount = 4;
    expect(card.canPlay(player)).is.not.true;
    corp.resourceCount = 5;
    expect(card.canPlay(player)).is.true;
  });
  it('Play', () => {
    addCity(player, '03');
    cast(card.play(player), undefined);

    expect(player.megaCredits).to.eq(1);

    player.megaCredits = 0;
    addCity(player, '05');
    cast(card.play(player), undefined);
    expect(player.megaCredits).to.eq(2);
  });
});
