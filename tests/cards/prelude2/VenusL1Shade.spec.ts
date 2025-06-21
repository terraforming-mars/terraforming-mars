import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {VenusL1Shade} from '../../../src/server/cards/prelude2/VenusL1Shade';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';

describe('VenusL1Shade', () => {
  let card: VenusL1Shade;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new VenusL1Shade();
    [game, player] = testGame(1, {venusNextExtension: true});
  });

  it('Should play', () => {
    card.play(player);
    expect(game.getVenusScaleLevel()).to.eq(6);
  });
});
