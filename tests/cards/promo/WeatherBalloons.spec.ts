import {expect} from 'chai';
import {WeatherBalloons} from '@/server/cards/promo/WeatherBalloons';
import {SpaceName} from '@/common/boards/SpaceName';
import {IGame} from '@/server/IGame';
import {OrOptions} from '@/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {addCity, runAllActions} from '../../TestingUtils';
import {cast} from '@/common/utils/utils';

describe('WeatherBalloons', () => {
  let card: WeatherBalloons;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new WeatherBalloons();
    [game, player] = testGame(2);
  });

  it('play', () => {
    expect(player.cardsInHand).has.lengthOf(0);
    card.play(player);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(card.resourceCount).to.eq(0);
  });

  it('action adds 1 floater automatically when there are no floaters here', () => {
    player.playedCards.push(card);

    card.action(player);
    runAllActions(game);

    expect(player.popWaitingFor()).is.undefined;
    expect(card.resourceCount).to.eq(1);
  });

  it('action offers a choice once a floater is stored here', () => {
    player.playedCards.push(card);
    card.resourceCount = 1;

    card.action(player);
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    expect(orOptions.options).has.lengthOf(2);

    orOptions.options[1].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(2);
  });

  for (const run of [
    {cities: 0, offworld: false, expected: 0},
    {cities: 1, offworld: false, expected: 1},
    {cities: 2, offworld: false, expected: 2},
    {cities: 1, offworld: true, expected: 1},
    {cities: 2, offworld: true, expected: 2},
  ]) {
    it('action ' + JSON.stringify(run), () => {
      player.playedCards.push(card);
      card.resourceCount = 2;

      for (const _ of Array(run.cities)) {
        addCity(player);
      }
      if (run.offworld) {
        addCity(player, SpaceName.GANYMEDE_COLONY);
      }

      card.action(player);
      runAllActions(game);

      const orOptions = cast(player.popWaitingFor(), OrOptions);
      orOptions.options[0].cb();

      expect(card.resourceCount).to.eq(1);
      expect(player.megaCredits).to.eq(run.expected);
    });
  }
});
