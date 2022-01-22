import {expect} from 'chai';
import {RestrictedArea} from '../../../src/cards/base/RestrictedArea';
import {ProjectInspection} from '../../../src/cards/promo/ProjectInspection';
import {IndenturedWorkers} from '../../../src/cards/base/IndenturedWorkers';
import {Playwrights} from '../../../src/cards/community/Playwrights';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {ICard} from '../../../src/cards/ICard';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('ProjectInspection', function() {
  let card : ProjectInspection; let player : Player; let restrictedArea: RestrictedArea;

  beforeEach(function() {
    card = new ProjectInspection();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    restrictedArea = new RestrictedArea();
  });

  it('Can\'t play if no actions played this turn', function() {
    player.playedCards.push(restrictedArea);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can\'t play if available actions can\'t act', function() {
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

    const play = card.play(player);
    expect(play instanceof SelectCard).is.true;
  });

  it('Can\'t play with Playwrights if there\'s no other card to chain', function() {
    const playwrights = new Playwrights();
    player.corporationCard = playwrights;

    player.addActionThisGeneration(playwrights.name);
    expect(card.canPlay(player)).is.false; // PI -> PW -> ???
  });

  it('Can be used to play Playwrights into another available event card', function() {
    const playwrights = new Playwrights();
    const indenturedWorkers = new IndenturedWorkers();
    player.corporationCard = playwrights;
    player.playedCards.push(indenturedWorkers);
    player.addActionThisGeneration(playwrights.name);
    expect(card.canPlay(player)).is.true; // PI -> PW -> PI -> PW -> IW

    player.playCard(card);
    const play1 = player.game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    expect(play1).is.not.undefined;
    expect(play1.cards).has.lengthOf(1); // Only PW is available
    expect(play1.cards[0]?.name).eq(playwrights.name);

    const action1 = play1.cb([playwrights]) as SelectCard<ICard>;
    expect(action1).is.not.undefined;
    expect(action1.cards).has.lengthOf(2); // IW and PI (which was just played) are available
    expect(action1.cards[0]?.name).eq(indenturedWorkers.name);
    expect(action1.cards[1]?.name).eq(card.name);
    action1.cb([card]) as SelectCard<ICard>;
    player.game.deferredActions.pop()!.execute(); // SelectHowToPay + Plays the card

    const play2 = player.game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    expect(play2).is.not.undefined;
    expect(play2.cards).has.lengthOf(1); // Only PW is available
    expect(play2.cards[0]?.name).eq(playwrights.name);

    const action2 = play2.cb([playwrights]) as SelectCard<ICard>;
    expect(action2).is.not.undefined;
    expect(action2.cards).has.lengthOf(1); // Only IW is available now
    expect(action2.cards[0]?.name).eq(indenturedWorkers.name);
  });

  it('Can be played by Playwrights into different blue card', function() {
    const playwrights = new Playwrights();
    player.corporationCard = playwrights;
    player.playedCards.push(card);
    player.playedCards.push(restrictedArea);
    player.addActionThisGeneration(restrictedArea.name);
    player.addActionThisGeneration(playwrights.name);
    player.addResource(Resources.MEGACREDITS, 2);
    expect(playwrights.canAct(player)).is.true; // PW -> PI -> RA

    const action1 = playwrights.action(player) as SelectCard<IProjectCard>;
    expect(action1).is.not.undefined;
    expect(action1.cards).has.lengthOf(1); // Only PI is available
    expect(action1.cards[0]?.name).eq(card.name);
    action1.cb([card]) as SelectCard<ICard>;
    player.game.deferredActions.pop()!.execute(); // SelectHowToPay + Plays the card

    const play1 = player.game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    expect(play1).is.not.undefined;
    expect(play1.cards).has.lengthOf(1); // Only RA is available
    expect(play1.cards[0]?.name).eq(restrictedArea.name);
  });

  it('Can be played by Playwrights into Playwrights into another available event card', function() {
    const playwrights = new Playwrights();
    const indenturedWorkers = new IndenturedWorkers();
    player.corporationCard = playwrights;
    player.playedCards.push(card);
    player.playedCards.push(indenturedWorkers);
    player.addActionThisGeneration(playwrights.name);
    player.addResource(Resources.MEGACREDITS, 2);
    expect(playwrights.canAct(player)).is.true; // PW -> PI -> PW -> IW

    const action1 = playwrights.action(player) as SelectCard<IProjectCard>;
    expect(action1).is.not.undefined;
    expect(action1.cards).has.lengthOf(2); // PI and IW are available
    expect(action1.cards[0]?.name).eq(card.name);
    action1.cb([card]) as SelectCard<ICard>;
    player.game.deferredActions.pop()!.execute(); // SelectHowToPay + Plays the card

    const play1 = player.game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    expect(play1).is.not.undefined;
    expect(play1.cards).has.lengthOf(1); // Only PW is available
    expect(play1.cards[0]?.name).eq(playwrights.name);

    const action2 = play1.cb([playwrights]) as SelectCard<ICard>;
    expect(action2).is.not.undefined;
    expect(action2.cards).has.lengthOf(1); // Only IW is available, PI has been removed from play
    expect(action2.cards[0]?.name).eq(indenturedWorkers.name);
  });
});
