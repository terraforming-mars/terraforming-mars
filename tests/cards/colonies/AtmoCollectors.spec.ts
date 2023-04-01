import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {AtmoCollectors} from '../../../src/server/cards/colonies/AtmoCollectors';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';

describe('AtmoCollectors', function() {
  let card: AtmoCollectors;
  let player: TestPlayer;

  beforeEach(function() {
    card = new AtmoCollectors();
    [/* skipped */, player] = testGame(2);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    const action = card.action(player);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(1);

    const orOptions = cast(card.action(player), OrOptions);

    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(player.titanium).to.eq(2);
  });
});
