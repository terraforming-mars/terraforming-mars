import {expect} from 'chai';
import {Psychrophiles} from '../../../src/server/cards/prelude/Psychrophiles';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('Psychrophiles', () => {
  let card: Psychrophiles;
  let player: Player;
  let game: Game;

  beforeEach(() => {
    card = new Psychrophiles();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
  });

  it('Cannot play', () => {
    (game as any).temperature = -18;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play', () => {
    (game as any).temperature = -20;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play', () => {
    expect(player.canPlayIgnoringCost(card)).is.true;
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Can act', () => {
    expect(card.canAct()).is.true;
  });

  it('Should act', () => {
    expect(player.getSpendableMicrobes()).to.eq(0);
    player.playedCards.push(card);

    card.action(player);
    expect(player.getCardsWithResources()).has.lengthOf(1);
    expect(player.getSpendableMicrobes()).to.eq(1);
  });
});
