import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Airliners} from '../../../src/server/cards/colonies/Airliners';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';

describe('Airliners', () => {
  let card: Airliners;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Airliners();
    [game, player] = testGame(1);
  });

  it('can play', () => {
    const jovianLanterns = new JovianLanterns();
    const searchForLife = new SearchForLife();

    player.playedCards.push(jovianLanterns, searchForLife);

    player.megaCredits = card.cost;

    searchForLife.resourceCount = 0;
    jovianLanterns.resourceCount = 0;
    expect(player.canPlay(card)).is.false;


    searchForLife.resourceCount = 0;
    jovianLanterns.resourceCount = 2;
    expect(player.canPlay(card)).is.false;

    searchForLife.resourceCount = 0;
    jovianLanterns.resourceCount = 3;
    expect(player.canPlay(card)).is.true;

    searchForLife.resourceCount = 3;
    jovianLanterns.resourceCount = 0;
    expect(player.canPlay(card)).is.false;
  });

  it('Should play', () => {
    expect(player.production.megacredits).eq(0);

    const jovianLanterns = new JovianLanterns();
    const searchForLife = new SearchForLife();

    player.playedCards.push(jovianLanterns, searchForLife);

    const action = card.play(player);

    runAllActions(game);

    cast(action, undefined);
    expect(player.production.megacredits).eq(2);
    expect(jovianLanterns.resourceCount).eq(2);
  });
});
