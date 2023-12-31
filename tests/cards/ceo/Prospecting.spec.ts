import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {SelectColony} from '../../../src/server/inputs/SelectColony';

import {Prospecting} from '../../../src/server/cards/underworld/Prospecting';
import {Venus} from '../../../src/server/cards/community/Venus';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';

describe('Prospecting', function() {
  let card: Prospecting;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Prospecting();
    [game, player/* , player2 */] = testGame(2, {coloniesExtension: true});
  });

  it('Can play', function() {
    expect(card.canPlay(player)).is.true;
  });

  it('play', function() {
    const coloniesInPlay = game.colonies.length;
    cast(card.play(player), undefined);
    runAllActions(player.game);
    const selectColony = cast(player.popWaitingFor(), SelectColony);
    const selectedColony = selectColony.colonies[0];
    selectColony.cb(selectedColony);
    expect(game.colonies).to.contain(selectedColony);
    expect(game.colonies.length).to.eq(coloniesInPlay + 1);
  });

  it('Venus cannot be activated, so is not selectable', () => {
    const venus = new Venus();
    game.discardedColonies.push(venus);
    cast(card.play(player), undefined);
    runAllActions(player.game);
    const selectColony = cast(player.popWaitingFor(), SelectColony);
    expect(selectColony.colonies).to.not.contain(venus);
  });

  it('Venus can be activated, so is not selectable', () => {
    player.setCorporationForTest(new Celestic());
    const venus = new Venus();
    game.discardedColonies = [];
    game.discardedColonies.push(venus);
    cast(card.play(player), undefined);
    runAllActions(player.game);
    const selectColony = cast(player.popWaitingFor(), SelectColony);
    expect(selectColony.colonies).to.contain(venus);
  });
});
