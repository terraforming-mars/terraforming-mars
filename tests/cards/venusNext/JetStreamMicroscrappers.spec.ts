import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {JetStreamMicroscrappers} from '../../../src/server/cards/venusNext/JetStreamMicroscrappers';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('JetStreamMicroscrappers', () => {
  let card: JetStreamMicroscrappers;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new JetStreamMicroscrappers();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
  });

  it('Should act', () => {
    player.playedCards.push(card);
    player.titanium = 2;

    // only one action possible
    expect(card.resourceCount).to.eq(0);
    const action = card.action(player);
    cast(action, undefined);
    expect(card.resourceCount).to.eq(2);
    expect(player.titanium).to.eq(1);

    // both actions possible
    const orOptions = cast(card.action(player), OrOptions);
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
