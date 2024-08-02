import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {forceGenerationEnd, testRedsCosts} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {PreservationProgram} from '../../../src/server/cards/prelude2/PreservationProgram';
import {Phase} from '../../../src/common/Phase';
import {BigAsteroid} from '../../../src/server/cards/base/BigAsteroid';

describe('PreservationProgram', () => {
  let card: PreservationProgram;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new PreservationProgram();
    [game, player] = testGame(2, {turmoilExtension: true});
  });

  it('play', () => {
    card.play(player);
    expect(player.getTerraformRating()).eq(25);
  });

  it('Blocks first TR of each generation', () => {
    card.play(player);
    player.playedCards.push(card);

    game.phase = Phase.ACTION;

    expect(player.getTerraformRating()).eq(25);

    player.increaseTerraformRating();
    expect(player.getTerraformRating()).eq(25);

    player.increaseTerraformRating();
    expect(player.getTerraformRating()).eq(26);

    player.increaseTerraformRating();
    expect(player.getTerraformRating()).eq(27);

    forceGenerationEnd(game);

    player.increaseTerraformRating();
    expect(player.getTerraformRating()).eq(27);

    player.increaseTerraformRating();
    expect(player.getTerraformRating()).eq(28);
  });

  it('Allows multi TR to go partially through', () => {
    card.play(player);
    player.playedCards.push(card);

    game.phase = Phase.ACTION;

    expect(player.getTerraformRating()).eq(25);

    player.increaseTerraformRating(3);
    expect(player.getTerraformRating()).eq(27);
  });

  it('Compatible with Reds', () => {
    // Big asteroid raises the temperature 2 steps.
    const bigAsteroid = new BigAsteroid();
    testRedsCosts(() => player.canPlay(bigAsteroid), player, bigAsteroid.cost, 6);

    const cb = () => {
      player.preservationProgram = true;
      return player.canPlay(bigAsteroid);
    };
    testRedsCosts(cb, player, bigAsteroid.cost, 3);
  });
});
