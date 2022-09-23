import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {MarsUniversity} from '../../../src/server/cards/base/MarsUniversity';
import {Pets} from '../../../src/server/cards/base/Pets';
import {Research} from '../../../src/server/cards/base/Research';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {OlympusConference} from '../../../src/server/cards/base/OlympusConference';
import {Mine} from '../../../src/server/cards/base/Mine';
import {EarthOffice} from '../../../src/server/cards/base/EarthOffice';
import {RoboticWorkforce} from '../../../src/server/cards/base/RoboticWorkforce';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('MarsUniversity', function() {
  let card: MarsUniversity;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new MarsUniversity();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;

    expect(card.onCardPlayed(player, new Pets())).is.undefined;
    expect(game.deferredActions).has.lengthOf(0);

    player.cardsInHand.push(card);
    card.onCardPlayed(player, card);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);
    game.deferredActions.pop();
    orOptions.options[0].cb([card]);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0]).not.to.eq(card);
    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(game.projectDeck.discardPile[0]).to.eq(card);
    expect(game.deferredActions).has.lengthOf(0);
  });

  it('Gives victory point', function() {
    card.play(player);
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Runs twice for multiple science tags', function() {
    player.cardsInHand.push(card, card);
    card.onCardPlayed(player, new Research());
    expect(game.deferredActions).has.lengthOf(2);

    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);
    game.deferredActions.pop();
    orOptions.options[1].cb();

    const orOptions2 = cast(game.deferredActions.peek()!.execute(), OrOptions);
    game.deferredActions.pop();
    orOptions2.options[1].cb();

    expect(game.deferredActions).has.lengthOf(0);
  });

  // https://github.com/terraforming-mars/terraforming-mars/issues/3251
  it('verifying Mars U play order', () => {
    // It actually doesn't matter in this specific test that Olympus Conference is first, but it's fine.
    // If that changes, this test can change, and/or be more flexible.
    player.cardsInHand = [new EarthOffice()];
    const olympusConference = new OlympusConference();
    const marsUniversity = new MarsUniversity();
    player.playedCards = [marsUniversity, olympusConference, new Mine()];
    olympusConference.resourceCount = 1;
    const roboticWorkforce = new RoboticWorkforce();
    player.playCard(roboticWorkforce);
    expect(game.deferredActions).has.lengthOf(3);

    const olympusConferenceAction = game.deferredActions.pop()?.execute();
    expect(olympusConferenceAction?.title).to.match(/Olympus Conference/);
    // Second option adds another resource.
    olympusConferenceAction?.options?.[1].cb();
    expect(olympusConference.resourceCount).eq(2);

    const marsUniversityAction = cast(game.deferredActions.pop()?.execute(), OrOptions);
    expect(marsUniversityAction.options[0].title).to.match(/Select a card to discard/);
    // Second option does nothing.
    marsUniversityAction?.options?.[1].cb();

    const roboticWorkforceAction = cast(game.deferredActions.pop()?.execute(), SelectCard);
    expect(roboticWorkforceAction.title).to.match(/Select builder card/);

    expect(game.deferredActions.pop()).is.undefined;
  });
});
