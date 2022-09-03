import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {RegolithEaters} from '../../../src/server/cards/base/RegolithEaters';
import {Research} from '../../../src/server/cards/base/Research';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {ICard} from '../../../src/server/cards/ICard';
import {BactoviralResearch} from '../../../src/server/cards/promo/BactoviralResearch';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('BactoviralResearch', function() {
  let card: BactoviralResearch;
  let player: Player;

  beforeEach(function() {
    card = new BactoviralResearch();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play with multiple microbe cards', function() {
    const card2 = new Research();
    const card3 = new RegolithEaters();
    const card4 = new Tardigrades();
    player.playedCards.push(card2, card3, card4);

    const action = cast(card.play(player), SelectCard<ICard>);
    action.cb([card3]);
    expect(card3.resourceCount).to.eq(4);
    expect(player.cardsInHand.length).to.eq(1);
  });

  it('Should play with single microbe card', function() {
    const card2 = new RegolithEaters();
    player.playedCards.push(card2);
    expect(card.play(player)).is.undefined;
    expect(card2.resourceCount).to.eq(2);
    expect(player.cardsInHand.length).to.eq(1);
  });

  it('Should play with no microbe cards', function() {
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand.length).to.eq(1);
  });
});
