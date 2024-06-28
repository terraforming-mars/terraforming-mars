import {expect} from 'chai';
import {ICard} from '../../../src/server/cards/ICard';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast, forceGenerationEnd} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Birds} from '../../../src/server/cards/base/Birds';
import {CommunicationCenter} from '../../../src/server/cards/pathfinders/CommunicationCenter';
import {Will} from '../../../src/server/cards/ceos/Will';

describe('Will', function() {
  let card: Will;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Will();
    [game, player] = testGame(1, {ceoExtension: true});
    player.playedCards.push(card);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Takes OPG action', function() {
    const birds = new Birds();
    const ants = new Ants();
    player.playedCards.push(birds, ants);

    card.action(player);
    expect(game.deferredActions).has.length(4);

    // Add animals
    game.deferredActions.runNext();
    expect(birds.resourceCount).eq(2);

    // Add microbes
    game.deferredActions.runNext();
    expect(ants.resourceCount).eq(2);

    game.deferredActions.runNext(); // No Floater resource cards, skip

    // Add resource to any card
    const selectCard = cast(game.deferredActions.pop()!.execute(), SelectCard<ICard>);
    selectCard.cb([selectCard.cards[1]]);
    expect(ants.resourceCount).eq(4);
  });

  it('Takes OPG w/ Communication Center', function() {
    const comms = new CommunicationCenter();
    player.playedCards.push(comms);
    comms.resourceCount = 2; // Put 2 data onto CommCenter

    // Sanity
    expect(comms.resourceCount).eq(2);
    expect(player.cardsInHand.length).to.eq(0);

    // Action
    card.action(player);
    expect(game.deferredActions).has.length(4);
    game.deferredActions.runNext(); // No animals
    game.deferredActions.runNext(); // No bugs
    game.deferredActions.runNext(); // No Floaters
    game.deferredActions.runNext(); // Two Wild on comms

    // We should have drawn a card here AND added another science to Comms
    expect(comms.resourceCount).eq(1);
    expect(player.cardsInHand.length).to.eq(1);
  });
});
