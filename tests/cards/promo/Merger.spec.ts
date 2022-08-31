import {expect} from 'chai';
import {ICard} from '../../../src/server/cards/ICard';
import {Merger} from '../../../src/server/cards/promo/Merger';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {cast, setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {ArcadianCommunities} from '../../../src/server/cards/promo/ArcadianCommunities';
import {SaturnSystems} from '../../../src/server/cards/corporation/SaturnSystems';
import {TerralabsResearch} from '../../../src/server/cards/turmoil/TerralabsResearch';
import {Splice} from '../../../src/server/cards/promo/Splice';
import {VestaShipyard} from '../../../src/server/cards/base/VestaShipyard';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Polyphemos} from '../../../src/server/cards/colonies/Polyphemos';
import {CARD_COST} from '../../../src/common/constants';
import {TharsisRepublic} from '../../../src/server/cards/corporation/TharsisRepublic';
import {CardName} from '../../../src/common/cards/CardName';
import {PointLuna} from '../../../src/server/cards/prelude/PointLuna';
import {Teractor} from '../../../src/server/cards/corporation/Teractor';
import {CheungShingMARS} from '../../../src/server/cards/prelude/CheungShingMARS';

describe('Merger', function() {
  let card : Merger; let player : Player; let player2: Player; let game : Game;

  beforeEach(() => {
    card = new Merger();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    const gameOptions = setCustomGameOptions({preludeExtension: true});
    game = Game.newInstance('gameid', [player, player2], player, gameOptions);

    // Preset corporation deck for testing
    game.dealer.corporationCards = [new ArcadianCommunities(), new SaturnSystems(), new TerralabsResearch(), new Polyphemos()];
  });

  it('Can play as long as have enough M€', function() {
    player.megaCredits = 28; // 28 + 14 from Terralabs is just enough to pay the cost of 42 M€
    card.play(player);

    const selectCorp = cast(game.deferredActions.pop()!.execute(), SelectCard<ICard>);
    expect(selectCorp.cards).has.length(4);
  });

  it('Excludes corps that player cannot afford', function() {
    player.megaCredits = 27;
    card.play(player);

    const selectCorp = cast(game.deferredActions.pop()!.execute(), SelectCard<ICard>);
    expect(selectCorp.cards).has.length(3);
  });

  it('Can play as long as have enough M€', function() {
    player.megaCredits = 28; // 28 + 14 from Terralabs is just enough to pay the cost of 42 M€
    card.play(player);

    const selectCorp = cast(game.deferredActions.pop()!.execute(), SelectCard<ICard>);
    const index = selectCorp.cards.findIndex((card) => card.name === CardName.ARCADIAN_COMMUNITIES);
    selectCorp.cb([selectCorp.cards[index]]); // Arcadian

    game.deferredActions.pop()!.execute(); // SelectPaymentDeferred
    expect(player.isCorporation(CardName.ARCADIAN_COMMUNITIES)).is.true;
    expect(player.pendingInitialActions).has.length(1);
  });

  it('Player has 2 corps after playing Merger', function() {
    player.corporations.push(new Splice());
    card.play(player);

    const selectCorp = cast(game.deferredActions.pop()!.execute(), SelectCard<ICard>);
    selectCorp.cb([selectCorp.cards[0]]);
    expect(player.corporations).has.length(2);
  });

  it('Player has effects of both corps', function() {
    player.corporations.push(new Splice());
    player.corporations.push(new SaturnSystems());
    player.megaCredits = 0;

    expect(player.isCorporation(CardName.SPLICE)).is.true;
    expect(player.isCorporation(CardName.SATURN_SYSTEMS)).is.true;

    player2.playCard(new VestaShipyard());
    expect(player.production.megacredits).to.eq(1); // Saturn Sys

    player2.playCard(new Ants());
    expect(player.megaCredits).to.eq(2); // Splice
  });

  it('Confirming that Cheung Shing Mars works', function() {
    player.corporations.push(new Splice());
    card.play(player);

    const cheungShingMARS = new CheungShingMARS();
    const selectCorp = cast(game.deferredActions.pop()!.execute(), SelectCard<ICard>);
    selectCorp.cb([cheungShingMARS]);
    expect(player.corporations).has.length(2);

    expect(player.isCorporation(CardName.SPLICE)).is.true;
    expect(player.isCorporation(CardName.CHEUNG_SHING_MARS)).is.true;

    expect(player.production.megacredits).to.eq(3);
  });

  it('Works with Terralabs played via Merger', function() {
    player.megaCredits = 50; // Ensure enough to pay for Merger cost
    card.play(player);

    const selectCorp = cast(game.deferredActions.pop()!.execute(), SelectCard<ICard>);
    const index = selectCorp.cards.findIndex((card) => card.name === CardName.TERRALABS_RESEARCH);
    selectCorp.cb([selectCorp.cards[index]]); // Terralabs
    expect(player.cardCost).to.eq(1);
  });

  it('Works with Polyphemos played via Merger', function() {
    card.play(player);

    const selectCorp = cast(game.deferredActions.pop()!.execute(), SelectCard<ICard>);
    const index = selectCorp.cards.findIndex((card) => card.name === CardName.POLYPHEMOS);
    selectCorp.cb([selectCorp.cards[index]]); // Polyphemos
    expect(player.cardCost).to.eq(5);
  });

  it('Works with both Terralabs and Polyphemos together', function() {
    game.playCorporationCard(player, new TerralabsResearch());
    Merger.playSecondCorporationCard(player, new Polyphemos());
    expect(player.cardCost).to.eq(CARD_COST);
  });

  it('Adds Merger corp initial action to player.pendingInitialActions', function() {
    game.playCorporationCard(player, new TharsisRepublic());
    expect(player.pendingInitialActions).has.length(1);

    card.play(player);

    const selectCorp = cast(game.deferredActions.pop()!.execute(), SelectCard<ICard>);
    const index = selectCorp.cards.findIndex((card) => card.name === CardName.ARCADIAN_COMMUNITIES);
    selectCorp.cb([selectCorp.cards[index]]); // Arcadian
    expect(player.pendingInitialActions).has.length(2);
  });

  it('Works with Point Luna and second corp with Earth tag', function() {
    game.playCorporationCard(player, new PointLuna());
    const handSize = player.cardsInHand.length;

    Merger.playSecondCorporationCard(player, new Teractor());
    game.deferredActions.runAll(() => {});
    expect(player.cardsInHand.length).to.eq(handSize + 1);
  });
});
