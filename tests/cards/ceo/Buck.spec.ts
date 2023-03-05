import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';

import {SelectCard} from '../../../src/server/inputs/SelectCard';

import {Buck} from '../../../src/server/cards/ceos/Buck';

import {AdvancedAlloys} from '../../../src/server/cards/base/AdvancedAlloys';
import {Comet} from '../../../src/server/cards/base/Comet';
import {ProtectedValley} from '../../../src/server/cards/base/ProtectedValley';
import {TerraformingGanymede} from '../../../src/server/cards/base/TerraformingGanymede';
import {StanfordTorus} from '../../../src/server/cards/promo/StanfordTorus';


describe('Buck', function() {
  let card: Buck;
  let player: TestPlayer;
  let game: Game;


  beforeEach(() => {
    card = new Buck();
    game = newTestGame(2);
    player = getTestPlayer(game, 0);
  });

  it('Cannot act', function() {
    expect(card.canAct(player)).is.false;

    // an Active and an Event:
    player.playedCards.push(new AdvancedAlloys(), new Comet());
    expect(card.canAct(player)).is.false;

    // Protected Valley overrides an Ocean, cannot be returned
    const playedCard = new ProtectedValley();
    player.playedCards.push(playedCard);
    expect(card.canAct(player)).is.false;
  });

  it('Takes OPG action', function() {
    const playedCard = new TerraformingGanymede();
    player.playedCards.push(playedCard);
    expect(card.canAct(player)).is.true;

    expect(player.playedCards).has.length(1);
    expect(player.cardsInHand).has.length(0);

    const selectCard = cast(card.action(player), SelectCard);
    selectCard.cb([playedCard]);

    expect(player.playedCards).has.length(0);
    expect(player.cardsInHand).has.length(1);
  });

  it('Takes OPG action, takes back a space-tile that cannot be replayed', function() {
    player.megaCredits = 200;
    const spaceCity = new StanfordTorus();
    const space = spaceCity.behavior?.city?.space as string;
    const boardSpace = player.game.board.getSpace(space);

    expect(spaceCity.canPlay(player)).is.true;
    expect(player.game.getCitiesCount()).to.eq(0);
    expect(boardSpace.player?.id).is.eq(undefined);

    player.playCard(spaceCity);
    // This feels hacky?  I want to see who the owner of the spaceCity space tile is
    expect(boardSpace.player?.id).is.eq(player.id);

    expect(player.game.getCitiesCount()).to.eq(1);
    expect(player.playedCards).has.length(1);
    expect(player.cardsInHand).has.length(0);
    expect(card.canAct(player)).is.true;

    const selectCard = cast(card.action(player), SelectCard);
    selectCard.cb([spaceCity]);
    expect(player.playedCards).has.length(0);
    expect(player.cardsInHand).has.length(1);

    expect(spaceCity.canPlay(player)).is.false;
  });

  it('Can only act once per game', function() {
    const playedCard = new TerraformingGanymede();
    player.cardsInHand.push(playedCard);

    const selectCard = cast(card.action(player), SelectCard);
    selectCard.cb([playedCard]);
    forceGenerationEnd(game);

    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
