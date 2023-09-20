import {expect} from 'chai';
import {CloneTroopers} from '../../../src/server/cards/starwars/CloneTroopers';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {addOcean, cast} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

describe('CloneTroopers', () => {
  let card: CloneTroopers;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new CloneTroopers();
    [game, player, player2] = testGame(2, {starWarsExpansion: true});
  });

  it('Can play', () => {
    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);

    expect(card.canPlay(player)).is.false;

    addOcean(player);

    expect(card.canPlay(player)).is.true;
  });

  it('act', () => {
    expect(card.resourceCount).eq(0);

    expect(card.action(player)).is.undefined;

    expect(card.resourceCount).eq(1);

    const orOptions = cast(card.action(player), OrOptions);
    orOptions.options[0].cb();

    expect(card.resourceCount).eq(2);

    expect(orOptions.options[1].cb()).is.undefined;
  });
});
