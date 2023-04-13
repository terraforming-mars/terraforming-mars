import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {AtmoCollectors} from '../../../src/server/cards/colonies/AtmoCollectors';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {Units} from '../../../src/common/Units';

describe('AtmoCollectors', function() {
  let card: AtmoCollectors;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AtmoCollectors();
    [game, player] = testGame(2);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);

    card.action(player);
    runAllActions(game);
    expect(player.popWaitingFor()).is.undefined;
    expect(card.resourceCount).to.eq(1);
    expect(player.purse()).deep.eq(Units.EMPTY);

    card.resourceCount = 3;

    card.action(player);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    orOptions.options[0].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(2);
    expect(player.purse()).deep.eq(Units.of({titanium: 2}));

    player.titanium = 0;

    orOptions.options[1].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
    expect(player.purse()).deep.eq(Units.of({energy: 3}));

    player.energy = 0;

    orOptions.options[2].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(0);
    expect(player.purse()).deep.eq(Units.of({heat: 4}));

    player.heat = 0;

    orOptions.options[3].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
    expect(player.purse()).deep.eq(Units.EMPTY);
  });
});
