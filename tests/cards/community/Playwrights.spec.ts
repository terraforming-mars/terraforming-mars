import {expect} from 'chai';
import {Playwrights} from '../../../src/cards/community/corporations/Playwrights';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {ReleaseOfInertGases} from '../../../src/cards/ReleaseOfInertGases';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Resources} from '../../../src/Resources';
import {IndenturedWorkers} from '../../../src/cards/IndenturedWorkers';
import {DeimosDown} from '../../../src/cards/DeimosDown';
import {ICard} from '../../../src/cards/ICard';
import {LocalHeatTrapping} from '../../../src/cards/LocalHeatTrapping';
import {MartianSurvey} from '../../../src/cards/prelude/MartianSurvey';

describe('Playwrights', function() {
  let card : Playwrights; let player : Player; let player2: Player; let game : Game;

  beforeEach(function() {
    card = new Playwrights();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);
    game = new Game('foobar', [player, player2], player);

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
        // SelectHowToPay
        game.deferredActions.shift()!.execute();

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
        // SelectHowToPay
        game.deferredActions.shift()!.execute();

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

        player.playCard(game, deimosDown);
        expect(player.getCardCost(game, deimosDown)).to.eq(deimosDown.cost); // no more discount
  });
});
