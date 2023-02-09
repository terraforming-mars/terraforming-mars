import {expect} from 'chai';
import {RestrictedArea} from '../../../src/server/cards/base/RestrictedArea';
import {ProjectInspection} from '../../../src/server/cards/promo/ProjectInspection';
import {IndenturedWorkers} from '../../../src/server/cards/base/IndenturedWorkers';
import {Playwrights} from '../../../src/server/cards/community/Playwrights';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';
import {ICard} from '../../../src/server/cards/ICard';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {Odyssey} from '../../../src/server/cards/pathfinders/Odyssey';
import {cast, runAllActions} from '../../TestingUtils';
import {Payment} from '../../../src/common/inputs/Payment';

describe('ProjectInspection', function() {
  let card: ProjectInspection;
  let player: TestPlayer;
  let restrictedArea: RestrictedArea;

  beforeEach(function() {
    card = new ProjectInspection();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    restrictedArea = new RestrictedArea();
  });

  it('Can not play if no actions played this turn', function() {
    player.playedCards.push(restrictedArea);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if available actions can not act', function() {
    player.playedCards.push(restrictedArea);
    player.addActionThisGeneration(restrictedArea.name);
    player.megaCredits = 1;

    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(restrictedArea);
    player.addResource(Resources.MEGACREDITS, 2);
    player.addActionThisGeneration(restrictedArea.name);
    expect(card.canPlay(player)).is.true;

    // returns SelectCard.
    cast(card.play(player), SelectCard);
  });

  it('Can not play with Playwrights if there is no other card to chain', function() {
    const playwrights = new Playwrights();
    player.setCorporationForTest(playwrights);

    player.addActionThisGeneration(playwrights.name);
    expect(card.canPlay(player)).is.false; // PI -> PW -> ???
  });

  it('Can be used to play Playwrights into another available event card', function() {
    const playwrights = new Playwrights();
    const indenturedWorkers = new IndenturedWorkers();
    player.setCorporationForTest(playwrights);
    player.playedCards.push(indenturedWorkers);
    player.addActionThisGeneration(playwrights.name);
    expect(card.canPlay(player)).is.true; // PI -> PW -> PI -> PW -> IW

    player.playCard(card);
    runAllActions(player.game);
    const play1 = cast(player.popWaitingFor(), SelectCard<ICard>);
    expect(play1.cards).has.lengthOf(1); // Only PW is available
    expect(play1.cards[0]?.name).eq(playwrights.name);

    const action1 = cast(play1.cb([playwrights]), SelectCard<ICard>);
    expect(action1.cards).has.lengthOf(2); // IW and PI (which was just played) are available
    expect(action1.cards[0]?.name).eq(indenturedWorkers.name);
    expect(action1.cards[1]?.name).eq(card.name);
    action1.cb([card]);

    runAllActions(player.game);
    const play2 = cast(player.popWaitingFor(), SelectCard<ICard>);
    expect(play2.cards).has.lengthOf(1); // Only PW is available
    expect(play2.cards[0]?.name).eq(playwrights.name);

    const action2 = cast(play2.cb([playwrights]), SelectCard<ICard>);
    expect(action2.cards).has.lengthOf(1); // Only IW is available now
    expect(action2.cards[0]?.name).eq(indenturedWorkers.name);
  });

  it('Can be used to play Odyssey into another available event card', function() {
    const odyssey = new Odyssey();
    const indenturedWorkers = new IndenturedWorkers();
    player.setCorporationForTest(odyssey);
    player.playedCards.push(indenturedWorkers);
    player.addActionThisGeneration(odyssey.name);
    expect(card.canPlay(player)).is.true; // PI -> OD -> PI -> OD -> IW
    runAllActions(player.game);

    player.playCard(card);
    runAllActions(player.game);
    const play1 = cast(player.popWaitingFor(), SelectCard<ICard>);
    expect(play1.cards).has.lengthOf(1); // Only OD is available
    expect(play1.cards[0]?.name).eq(odyssey.name);

    const action1 = cast(play1.cb([odyssey]), SelectProjectCardToPlay);
    expect(action1.cards).has.lengthOf(2); // IW and PI (which was just played) are available
    expect(action1.cards[0]?.name).eq(indenturedWorkers.name);
    expect(action1.cards[1]?.name).eq(card.name);
    action1.cb(card, Payment.EMPTY);
    runAllActions(player.game);

    const play2 = cast(player.popWaitingFor(), SelectCard);
    expect(play2.cards).has.lengthOf(1); // Only PW is available
    expect(play2.cards[0]?.name).eq(odyssey.name);

    const action2 = cast(play2.cb([odyssey]), SelectProjectCardToPlay);
    expect(action2.cards).has.lengthOf(1); // Only IW is available now
    expect(action2.cards[0]?.name).eq(indenturedWorkers.name);
  });

  it('Can be played by Playwrights into different blue card', function() {
    const playwrights = new Playwrights();
    player.setCorporationForTest(playwrights);
    player.playedCards.push(card);
    player.playedCards.push(restrictedArea);
    player.addActionThisGeneration(restrictedArea.name);
    player.addActionThisGeneration(playwrights.name);
    player.addResource(Resources.MEGACREDITS, 2);
    expect(playwrights.canAct(player)).is.true; // PW -> PI -> RA

    const action1 = cast(playwrights.action(player), SelectCard<IProjectCard>);
    expect(action1.cards).has.lengthOf(1); // Only PI is available
    expect(action1.cards[0]?.name).eq(card.name);
    action1.cb([card]);
    runAllActions(player.game);

    const play1 = cast(player.popWaitingFor(), SelectCard<ICard>);
    expect(play1.cards).has.lengthOf(1); // Only RA is available
    expect(play1.cards[0]?.name).eq(restrictedArea.name);
  });

  it('Can be played by Playwrights into Playwrights into another available event card', function() {
    const playwrights = new Playwrights();
    const indenturedWorkers = new IndenturedWorkers();
    player.setCorporationForTest(playwrights);
    player.playedCards.push(card);
    player.playedCards.push(indenturedWorkers);
    player.addActionThisGeneration(playwrights.name);
    player.addResource(Resources.MEGACREDITS, 2);
    expect(playwrights.canAct(player)).is.true; // PW -> PI -> PW -> IW

    const action1 = cast(playwrights.action(player), SelectCard<IProjectCard>);
    expect(action1.cards).has.lengthOf(2); // PI and IW are available
    expect(action1.cards[0]?.name).eq(card.name);
    action1.cb([card]);
    runAllActions(player.game);

    const play1 = cast(player.popWaitingFor(), SelectCard<ICard>);
    expect(play1.cards).has.lengthOf(1); // Only PW is available
    expect(play1.cards[0]?.name).eq(playwrights.name);

    const action2 = cast(play1.cb([playwrights]), SelectCard<ICard>);
    expect(action2.cards).has.lengthOf(1); // Only IW is available, PI has been removed from play
    expect(action2.cards[0]?.name).eq(indenturedWorkers.name);
  });
});
