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
import {cast, runAllActions} from '../../TestingUtils';

describe('Playwrights', () => {
  let card: Playwrights;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Playwrights();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);

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

    (game as any).oxygenLevel = 5;
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
});
