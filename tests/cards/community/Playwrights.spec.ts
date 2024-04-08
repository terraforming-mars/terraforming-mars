import {expect} from 'chai';
import {DeimosDown} from '../../../src/server/cards/base/DeimosDown';
import {IndenturedWorkers} from '../../../src/server/cards/base/IndenturedWorkers';
import {LocalHeatTrapping} from '../../../src/server/cards/base/LocalHeatTrapping';
import {ReleaseOfInertGases} from '../../../src/server/cards/base/ReleaseOfInertGases';
import {Playwrights} from '../../../src/server/cards/community/Playwrights';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {MartianSurvey} from '../../../src/server/cards/prelude/MartianSurvey';
import {LawSuit} from '../../../src/server/cards/promo/LawSuit';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, setOxygenLevel} from '../../TestingUtils';
import {SpecialDesign} from '../../../src/server/cards/base/SpecialDesign';
import {ICard} from '../../../src/server/cards/ICard';
import {GlobalParameter} from '../../../src/common/GlobalParameter';
import {Worms} from '../../../src/server/cards/base/Worms';
import {testGame} from '../../TestGame';

describe('Playwrights', () => {
  let card: Playwrights;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Playwrights();
    [game, player, player2] = testGame(2);

    card.play(player);
    player.setCorporationForTest(card);
  });

  it('Cannot act without any played events', () => {
    expect(player.production.energy).eq(1);
    expect(card.canAct(player)).is.not.true;
  });

  it('Can replay own event', () => {
    const event = new ReleaseOfInertGases();
    const tr = player.getTerraformRating();
    event.play(player);
    player.playedCards.push(event);

    expect(player.getTerraformRating()).to.eq(tr + 2);
    expect(card.canAct(player)).is.not.true;

    player.megaCredits = event.cost;
    expect(card.canAct(player)).is.true;

    const selectCard = cast(card.action(player), SelectCard<IProjectCard>);
    selectCard.cb([event]);

    game.deferredActions.pop()!.execute(); // SelectPayment
    runAllActions(game);

    expect(player.getTerraformRating()).to.eq(tr + 4);
    expect(player.megaCredits).eq(0);
    expect(player.playedCards).has.lengthOf(0);
    expect(player.removedFromPlayCards).has.lengthOf(1);
  });

  it('Can replay other player\'s event', () => {
    const event = new ReleaseOfInertGases();
    const tr = player.getTerraformRating();
    event.play(player2);
    player2.playedCards.push(event);

    player.megaCredits = event.cost;
    expect(card.canAct(player)).is.true;
    const selectCard = cast(card.action(player), SelectCard<IProjectCard>);
    selectCard.cb([event]);

    game.deferredActions.pop()!.execute(); // SelectPayment
    runAllActions(game);

    expect(player.getTerraformRating()).to.eq(tr + 2);
    expect(player.megaCredits).eq(0);
    expect(player2.playedCards).has.lengthOf(0);
    expect(player.removedFromPlayCards).has.lengthOf(1);
  });

  it('Cannot act without any playable events', () => {
    player2.playedCards.push(new MartianSurvey(), new LocalHeatTrapping(), new DeimosDown());

    setOxygenLevel(game, 5);
    player.heat = 4;
    player.megaCredits = 30;
    expect(card.canAct(player)).is.not.true;
  });

  it('Acts correctly for event cards that give one time discount', () => {
    const indenturedWorkers = new IndenturedWorkers();
    player.playedCards.push(indenturedWorkers);

    const selectCard = cast(card.action(player), SelectCard<IProjectCard>);
    selectCard.cb([indenturedWorkers]);
    // SelectPayment
    game.deferredActions.pop()!.execute();

    const deimosDown = new DeimosDown();
    expect(player.getCardCost(deimosDown)).to.eq(deimosDown.cost - 8);

    player.playCard(deimosDown);
    expect(player.getCardCost(deimosDown)).to.eq(deimosDown.cost); // no more discount
  });

  it('Works with Law Suit', () => {
    const event = new LawSuit();
    player2.playedCards.push(event);

    player.megaCredits = event.cost;
    player.removingPlayers = [player2.id];
    expect(card.canAct(player)).is.true;

    const selectCard = cast(card.action(player), SelectCard<IProjectCard>);
    selectCard.cb([event]);

    game.deferredActions.pop()!.execute(); // SelectPayment
    const selectPlayer = cast(game.deferredActions.pop()!.execute(), SelectPlayer);
    selectPlayer.cb(player2);

    runAllActions(player.game);

    expect(player.playedCards).has.lengthOf(0);
    expect(player2.playedCards).has.lengthOf(0); // Card is removed from play for sued player
    expect(player.removedFromPlayCards).has.lengthOf(1);
  });

  it('Works with Special Design', () => {
    const event = new SpecialDesign();
    player2.playedCards.push(event);

    player.megaCredits = event.cost;
    expect(card.canAct(player)).is.true;

    const selectCard = cast(card.action(player), SelectCard<ICard>);
    selectCard.cb([event]);

    runAllActions(game);

    expect(player.getGlobalParameterRequirementBonus(GlobalParameter.OXYGEN)).to.eq(2);

    const lastRemovedFromPlayCard = player.removedFromPlayCards[player.removedFromPlayCards.length - 1];
    expect(lastRemovedFromPlayCard.name).to.eq(event.name);

    player.playCard(new Worms());
    expect(player.getGlobalParameterRequirementBonus(GlobalParameter.OXYGEN)).to.eq(0);
    expect(player.removedFromPlayCards).deep.eq([event]);
  });

  it('Works with Special Design after deserialization', () => {
    const event = new SpecialDesign();
    player2.playedCards.push(event);

    player.megaCredits = event.cost;
    expect(card.canAct(player)).is.true;

    const selectCard = cast(card.action(player), SelectCard<ICard>);
    selectCard.cb([event]);

    runAllActions(game);

    expect(player.getGlobalParameterRequirementBonus(GlobalParameter.OXYGEN)).to.eq(2);

    const serialized = game.serialize();
    const newGame = Game.deserialize(serialized);
    const newPlayer = newGame.getPlayerById(player.id);

    const lastRemovedFromPlayCard = newPlayer.removedFromPlayCards[player.removedFromPlayCards.length - 1];
    expect(lastRemovedFromPlayCard.name).to.eq(event.name);

    newPlayer.playCard(new Worms());
    expect(newPlayer.getGlobalParameterRequirementBonus(GlobalParameter.OXYGEN)).to.eq(0);
    expect(newPlayer.removedFromPlayCards).deep.eq([event]);
  });
});
