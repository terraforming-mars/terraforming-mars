import {expect} from 'chai';
import {CloudCity} from '../../../src/server/cards/starwars/CloudCity';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions, setVenusScaleLevel} from '../../TestingUtils';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';

describe('CloudCity', () => {
  let card: CloudCity;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new CloudCity();
    [game, player] = testGame(1, {venusNextExtension: true});
  });

  it('Can play', () => {
    setVenusScaleLevel(game, 4);

    expect(card.canPlay(player)).is.false;

    setVenusScaleLevel(game, 6);

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const jovianLanterns = new JovianLanterns();
    player.playedCards.push(jovianLanterns);
    setVenusScaleLevel(game, 4);

    expect(card.play(player)).is.undefined;

    runAllActions(game);

    expect(game.getVenusScaleLevel()).eq(6);
    expect(jovianLanterns.resourceCount).eq(2);
  });
});
