import {expect} from 'chai';
import {DeimosDown} from '../../../src/cards/base/DeimosDown';
import {IndenturedWorkers} from '../../../src/cards/base/IndenturedWorkers';
import {LocalHeatTrapping} from '../../../src/cards/base/LocalHeatTrapping';
import {ReleaseOfInertGases} from '../../../src/cards/base/ReleaseOfInertGases';
import {Playwrights} from '../../../src/cards/community/Playwrights';
import {ICard} from '../../../src/cards/ICard';
import {MartianSurvey} from '../../../src/cards/prelude/MartianSurvey';
import {LawSuit} from '../../../src/cards/promo/LawSuit';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {SelectPlayer} from '../../../src/inputs/SelectPlayer';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Playwrights', function() {
  let card : Playwrights; let player : Player; let player2: Player; let game : Game;

  beforeEach(function() {
    card = new Playwrights();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);

    card.play(player);
    player.corporationCard = card;
  });

  it('Cannot act without any played events', function() {
    expect(player.getProduction(Resources.ENERGY)).eq(1);
    expect(card.canAct(player, game)).is.not.true;
  });

  it('Can replay own event', function() {
    const event = new ReleaseOfInertGases();
    const tr = player.getTerraformRating();
    event.play(player, game);
    player.playedCards.push(event);

    expect(player.getTerraformRating()).to.eq(tr + 2);
    expect(card.canAct(player, game)).is.not.true;

    player.megaCredits = event.cost;
    expect(card.canAct(player, game)).is.true;

    const selectCard = card.action(player, game) as SelectCard<ICard>;
    selectCard.cb([event]);

    game.deferredActions.shift()!.execute(); // SelectHowToPay
    game.deferredActions.runAll(() => {});

    expect(player.getTerraformRating()).to.eq(tr + 4);
    expect(player.megaCredits).eq(0);
    expect(player.playedCards).has.lengthOf(0);
    expect(player.removedFromPlayCards).has.lengthOf(1);
  });

  it('Can replay other player\'s event', function() {
    const event = new ReleaseOfInertGases();
    const tr = player.getTerraformRating();
    event.play(player2, game);
    player2.playedCards.push(event);

    player.megaCredits = event.cost;
    expect(card.canAct(player, game)).is.true;
    const selectCard = card.action(player, game) as SelectCard<ICard>;
    selectCard.cb([event]);

    game.deferredActions.shift()!.execute(); // SelectHowToPay
    game.deferredActions.runAll(() => {});

    expect(player.getTerraformRating()).to.eq(tr + 2);
    expect(player.megaCredits).eq(0);
    expect(player2.playedCards).has.lengthOf(0);
    expect(player.removedFromPlayCards).has.lengthOf(1);
  });

  it('Cannot act without any playable events', function() {
    player2.playedCards.push(new MartianSurvey(), new LocalHeatTrapping(), new DeimosDown());

    (game as any).oxygenLevel = 5;
    player.heat = 4;
    player.megaCredits = 30;
    expect(card.canAct(player, game)).is.not.true;
  });

  it('Acts correctly for event cards that give one time discount', function() {
    const indenturedWorkers = new IndenturedWorkers();
    player.playedCards.push(indenturedWorkers);

    const selectCard = card.action(player, game) as SelectCard<ICard>;
    selectCard.cb([indenturedWorkers]);
        // SelectHowToPay
        game.deferredActions.shift()!.execute();

        const deimosDown = new DeimosDown();
        expect(player.getCardCost(game, deimosDown)).to.eq(deimosDown.cost - 8);

        player.playCard(deimosDown);
        expect(player.getCardCost(game, deimosDown)).to.eq(deimosDown.cost); // no more discount
  });

  it('Works with Law Suit', function() {
    const event = new LawSuit();
    player2.playedCards.push(event);

    player.megaCredits = event.cost;
    player.removingPlayers = [player2.id];
    expect(card.canAct(player, game)).is.true;

    const selectCard = card.action(player, game) as SelectCard<ICard>;
    selectCard.cb([event]);

    game.deferredActions.shift()!.execute(); // SelectHowToPay
    const selectPlayer = game.deferredActions.shift()!.execute() as SelectPlayer;
    selectPlayer.cb(player2);

    game.deferredActions.runAll(() => {});

    expect(player.playedCards).has.lengthOf(0);
    expect(player2.playedCards).has.lengthOf(0); // Card is removed from play for sued player
    expect(player.removedFromPlayCards).has.lengthOf(1);
  });
});
