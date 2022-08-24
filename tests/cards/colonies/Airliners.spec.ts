import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Airliners} from '../../../src/server/cards/colonies/Airliners';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions} from '../../TestingUtils';

describe('Airliners', function() {
  let card: Airliners;
  let game: Game;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Airliners();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('can play', function() {
    const jovianLanterns = new JovianLanterns();
    const searchForLife = new SearchForLife();

    player.playedCards = [jovianLanterns, searchForLife];

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

  it('Should play', function() {
    expect(player.production.megacredits).eq(0);

    const jovianLanterns = new JovianLanterns();
    const searchForLife = new SearchForLife();

    player.playedCards = [jovianLanterns, searchForLife];

    const action = card.play(player);

    runAllActions(game);

    expect(action).is.undefined;
    expect(player.production.megacredits).eq(2);
    expect(jovianLanterns.resourceCount).eq(2);
  });
});
