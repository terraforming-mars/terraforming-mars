import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {RegolithEaters} from '../../../src/server/cards/base/RegolithEaters';
import {Research} from '../../../src/server/cards/base/Research';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {ICard} from '../../../src/server/cards/ICard';
import {BactoviralResearch} from '../../../src/server/cards/promo/BactoviralResearch';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';

describe('BactoviralResearch', function() {
  let card: BactoviralResearch;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new BactoviralResearch();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play with multiple microbe cards', function() {
    const card2 = new Research();
    const card3 = new RegolithEaters();
    const card4 = new Tardigrades();
    player.playedCards.push(card2, card3, card4);

    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard<ICard>);
    action.cb([card3]);
    expect(card3.resourceCount).to.eq(4);
    expect(player.cardsInHand.length).to.eq(1);
  });

  it('Should play with single microbe card', function() {
    const card2 = new RegolithEaters();
    player.playedCards.push(card2);
    expect(card.play(player)).is.undefined;

    runAllActions(game);

    expect(card2.resourceCount).to.eq(2);
    expect(player.cardsInHand.length).to.eq(1);
  });

  it('Should play with no microbe cards', function() {
    expect(card.play(player)).is.undefined;
    runAllActions(game);

    expect(player.cardsInHand.length).to.eq(1);
  });
});
