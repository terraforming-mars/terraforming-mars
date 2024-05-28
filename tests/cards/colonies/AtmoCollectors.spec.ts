import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {AtmoCollectors} from '../../../src/server/cards/colonies/AtmoCollectors';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {Units} from '../../../src/common/Units';

describe('AtmoCollectors', function() {
  let card: AtmoCollectors;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new AtmoCollectors();
    [game, player] = testGame(2);
  });

  it('Should play', function() {
    cast(card.play(player), undefined);
  });

  it('Should act', function() {
    player.playedCards.push(card);

    card.action(player);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(card.resourceCount).to.eq(1);
    expect(player.stock.asUnits()).deep.eq(Units.EMPTY);

    card.resourceCount = 3;

    card.action(player);
    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    orOptions.options[0].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(2);
    expect(player.stock.asUnits()).deep.eq(Units.of({titanium: 2}));

    player.titanium = 0;

    orOptions.options[1].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
    expect(player.stock.asUnits()).deep.eq(Units.of({energy: 3}));

    player.energy = 0;

    orOptions.options[2].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(0);
    expect(player.stock.asUnits()).deep.eq(Units.of({heat: 4}));

    player.heat = 0;

    orOptions.options[3].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
    expect(player.stock.asUnits()).deep.eq(Units.EMPTY);
  });
});
