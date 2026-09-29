import {expect} from 'chai';
import {runAllActions} from '../../TestingUtils';
import {MarsUniversity} from '../../../src/server/cards/base/MarsUniversity';
import {Pets} from '../../../src/server/cards/base/Pets';
import {Research} from '../../../src/server/cards/base/Research';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {OlympusConference} from '../../../src/server/cards/base/OlympusConference';
import {Mine} from '../../../src/server/cards/base/Mine';
import {EarthOffice} from '../../../src/server/cards/base/EarthOffice';
import {RoboticWorkforce} from '../../../src/server/cards/base/RoboticWorkforce';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {testGame} from '../../TestGame';
import {Leavitt} from '../../../src/server/cards/community/Leavitt';
import {cast} from '../../../src/common/utils/utils';
import {NaturalPreserve} from '../../../src/server/cards/base/NaturalPreserve';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {ResearchColony} from '../../../src/server/cards/colonies/ResearchColony';
import {SelectColony} from '../../../src/server/inputs/SelectColony';
import {Callisto} from '../../../src/server/colonies/Callisto';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {Miranda} from '../../../src/server/colonies/Miranda';
import {InventionContest} from '../../../src/server/cards/base/InventionContest';

describe('MarsUniversity', () => {
  let card: MarsUniversity;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new MarsUniversity();
    [game, player] = testGame(2);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
    expect(card.onCardPlayed(player, new Pets())).is.undefined;
    expect(game.deferredActions).has.lengthOf(0);

    player.cardsInHand.push(card);
    card.onCardPlayed(player, card);

    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);

    orOptions.options[0].cb([card]);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0]).not.to.eq(card);
    expect(game.projectDeck.discardPile).has.lengthOf(1);
    expect(game.projectDeck.discardPile[0]).to.eq(card);
    expect(game.deferredActions).has.lengthOf(0);
  });

  it('Gives victory point', () => {
    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });

  it('Runs twice for multiple science tags', () => {
    player.cardsInHand.push(card, card);
    card.onCardPlayed(player, new Research());

    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[1].cb();


    runAllActions(game);
    const orOptions2 = cast(player.popWaitingFor(), OrOptions);
    orOptions2.options[1].cb();

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });

  // https://github.com/terraforming-mars/terraforming-mars/issues/3251
  it('verifying Mars U play order', () => {
    // It actually doesn't matter in this specific test that Olympus Conference is first, but it's fine.
    // If that changes, this test can change, and/or be more flexible.
    player.cardsInHand = [new EarthOffice()];
    const olympusConference = new OlympusConference();
    const marsUniversity = new MarsUniversity();
    player.playedCards.push(marsUniversity, olympusConference, new Mine());
    olympusConference.resourceCount = 1;
    const roboticWorkforce = new RoboticWorkforce();
    player.playCard(roboticWorkforce);
    expect(game.deferredActions).has.lengthOf(3);

    const olympusConferenceAction = cast(game.deferredActions.pop()?.execute(), OrOptions);
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

  // https://github.com/terraforming-mars/terraforming-mars/issues/5488
  it('Tile placement comes before Mars U', () => {
    player.cardsInHand = [new EarthOffice()];
    player.playedCards.push(card);

    player.playCard(new NaturalPreserve());
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    expect(orOptions.options[0].title).to.match(/Select a card to discard/);
  });

  // https://github.com/terraforming-mars/terraforming-mars/issues/5488
  it('Colony placement comes before Mars U', () => {
    [game, player] = testGame(2, {coloniesExtension: true});
    game.colonies = [new Callisto(), new Ceres(), new Miranda()];
    player.cardsInHand = [new EarthOffice()];
    player.playedCards.push(card);

    player.playCard(new ResearchColony());
    runAllActions(game);

    const selectColony = cast(player.popWaitingFor(), SelectColony);
    selectColony.cb(selectColony.colonies[0]);
    runAllActions(game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    expect(orOptions.options[0].title).to.match(/Select a card to discard/);
  });

  // https://github.com/terraforming-mars/terraforming-mars/issues/5986
  it('Invention Contest comes before Mars U', () => {
    player.cardsInHand = [];
    player.playedCards.push(card);

    player.playCard(new InventionContest());
    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    const kept = selectCard.cards[0];
    selectCard.cb([kept]);
    runAllActions(game);

    expect(player.cardsInHand).deep.eq([kept]);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    const discard = cast(orOptions.options[0], SelectCard);
    expect(discard.cards).deep.eq([kept]);
  });

  it('Compatible with Leavitt #6349', () => {
    player.cardsInHand = [new EarthOffice()];
    player.playedCards.push(card);
    const leavitt = new Leavitt();
    leavitt.addColony(player);

    runAllActions(game);
    cast(player.popWaitingFor(), OrOptions);
  });
});
