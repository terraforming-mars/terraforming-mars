import {expect} from 'chai';
import {ICard} from '../../../src/server/cards/ICard';
import {Merger} from '../../../src/server/cards/promo/Merger';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {ArcadianCommunities} from '../../../src/server/cards/promo/ArcadianCommunities';
import {SaturnSystems} from '../../../src/server/cards/corporation/SaturnSystems';
import {TerralabsResearch} from '../../../src/server/cards/turmoil/TerralabsResearch';
import {Splice} from '../../../src/server/cards/promo/Splice';
import {VestaShipyard} from '../../../src/server/cards/base/VestaShipyard';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Polyphemos} from '../../../src/server/cards/colonies/Polyphemos';
import {TharsisRepublic} from '../../../src/server/cards/corporation/TharsisRepublic';
import {CardName} from '../../../src/common/cards/CardName';
import {PointLuna} from '../../../src/server/cards/prelude/PointLuna';
import {Teractor} from '../../../src/server/cards/corporation/Teractor';
import {CheungShingMARS} from '../../../src/server/cards/prelude/CheungShingMARS';
import {BeginnerCorporation} from '../../../src/server/cards/corporation/BeginnerCorporation';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {Asteroid} from '../../../src/server/cards/base/Asteroid';
import {Helion} from '../../../src/server/cards/corporation/Helion';
import {ICorporationCard} from '../../../src/server/cards/corporation/ICorporationCard';
import {Viron} from '../../../src/server/cards/venusNext/Viron';
import {SeptumTribus} from '../../../src/server/cards/turmoil/SeptumTribus';
import {testGame} from '../../TestGame';
import {Aridor} from '../../../src/server/cards/colonies/Aridor';
import {Manutech} from '../../../src/server/cards/venusNext/Manutech';
import {AgricolaInc} from '../../../src/server/cards/community/AgricolaInc';
import {LunaTradeFederation} from '../../../src/server/cards/moon/LunaTradeFederation';
import {ProjectWorkshop} from '../../../src/server/cards/community/ProjectWorkshop';
import {Units} from '../../../src/common/Units';
import {LunaFirstIncorporated} from '../../../src/server/cards/moon/LunaFirstIncorporated';
import {TheGrandLunaCapitalGroup} from '../../../src/server/cards/moon/TheGrandLunaCapitalGroup';
import {Chimera} from '../../../src/server/cards/pathfinders/Chimera';
import {PhoboLog} from '../../../src/server/cards/corporation/PhoboLog';
import {ValleyTrust} from '../../../src/server/cards/prelude/ValleyTrust';
import {InterplanetaryCinematics} from '../../../src/server/cards/corporation/InterplanetaryCinematics';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Inventrix} from '../../../src/server/cards/corporation/Inventrix';
import {Ambient} from '../../../src/server/cards/pathfinders/Ambient';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {asArray} from '../../../src/common/utils/utils';

describe('Merger', () => {
  let merger: Merger;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    merger = new Merger();
    [game, player, player2] = testGame(2, {preludeExtension: true, turmoilExtension: true});

    // Preset corporation deck for testing
    game.corporationDeck.drawPile = [new ArcadianCommunities(), new SaturnSystems(), new TerralabsResearch(), new Polyphemos()];
  });

  function enabledMap(selectCard: SelectCard<ICorporationCard>): Array<[CardName, boolean]> {
    return selectCard.cards.map((card, idx) => [card.name, selectCard.config.enabled![idx]]);
  }

  it('Can play as long as have enough M€', () => {
    player.corporations.push(new BeginnerCorporation()); // Vestigial corporation
    player.megaCredits = 28; // 28 + 14 from Terralabs is just enough to pay the cost of 42 M€
    merger.play(player);
    runAllActions(game);

    const selectCorp = cast(player.popWaitingFor(), SelectCard<ICorporationCard>);

    expect(enabledMap(selectCorp)).to.have.deep.members(
      [
        [CardName.ARCADIAN_COMMUNITIES, true],
        [CardName.SATURN_SYSTEMS, true],
        [CardName.POLYPHEMOS, true],
        [CardName.TERRALABS_RESEARCH, true],
      ]);
  });

  it('Excludes corps that player cannot afford', () => {
    player.megaCredits = 27;
    merger.play(player);
    runAllActions(game);

    const selectCorp = cast(player.popWaitingFor(), SelectCard<ICorporationCard>);
    expect(enabledMap(selectCorp)).to.have.deep.members(
      [
        [CardName.ARCADIAN_COMMUNITIES, true],
        [CardName.SATURN_SYSTEMS, true],
        [CardName.POLYPHEMOS, true],
        [CardName.TERRALABS_RESEARCH, false],
      ]);
  });

  it('Fizzle if player cannot play any corp', () => {
    player.corporations.push(new BeginnerCorporation()); // Vestigial corporation
    player.megaCredits = 0;
    game.corporationDeck.drawPile = [new ValleyTrust(), new PhoboLog(), new TerralabsResearch(), new InterplanetaryCinematics()];
    merger.play(player);
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(player.megaCredits).eq(15);
  });

  it('Can play as long as have enough M€', () => {
    player.corporations = [new BeginnerCorporation()]; // Vestigial corporation
    player.megaCredits = 28; // 28 + 14 from Terralabs is just enough to pay the cost of 42 M€
    merger.play(player);
    runAllActions(game);

    const selectCorp = cast(player.popWaitingFor(), SelectCard<ICard>);
    const index = selectCorp.cards.findIndex((card) => card.name === CardName.ARCADIAN_COMMUNITIES);
    selectCorp.cb([selectCorp.cards[index]]); // Arcadian
    runAllActions(game);

    expect(player.isCorporation(CardName.ARCADIAN_COMMUNITIES)).is.true;
    expect(player.pendingInitialActions).has.length(1);
  });

  it('Player has 2 corps after playing Merger', () => {
    player.corporations.push(new Splice());
    merger.play(player);
    runAllActions(game);

    const selectCorp = cast(player.popWaitingFor(), SelectCard<ICard>);
    selectCorp.cb([selectCorp.cards[0]]);
    expect(player.corporations).has.length(2);
  });

  it('Player has effects of both corps', () => {
    player.corporations.push(new Splice(), new SaturnSystems());
    player.megaCredits = 0;

    expect(player.isCorporation(CardName.SPLICE)).is.true;
    expect(player.isCorporation(CardName.SATURN_SYSTEMS)).is.true;

    player2.playCard(new VestaShipyard());
    runAllActions(game);

    expect(player.production.megacredits).to.eq(1); // Saturn Systems

    player2.playCard(new Ants());

    runAllActions(game);
    const orOptions = cast(player2.popWaitingFor(), OrOptions);
    orOptions.options[1].cb(); // Gain MC.
    runAllActions(game);

    expect(player.megaCredits).to.eq(2); // Splice
  });

  it('Confirming that Cheung Shing Mars works', () => {
    player.corporations.push(new Splice());
    merger.play(player);
    runAllActions(game);

    const selectCorp = cast(player.popWaitingFor(), SelectCard<ICard>);
    const cheungShingMARS = new CheungShingMARS();
    selectCorp.cb([cheungShingMARS]);
    expect(player.corporations).has.length(2);

    expect(player.isCorporation(CardName.SPLICE)).is.true;
    expect(player.isCorporation(CardName.CHEUNG_SHING_MARS)).is.true;

    expect(player.production.megacredits).to.eq(3);
  });

  it('Works with Terralabs played via Merger', () => {
    player.corporations = [new BeginnerCorporation()]; // Vestigial corporation
    player.megaCredits = 50; // Ensure enough to pay for Merger cost
    merger.play(player);
    runAllActions(game);

    const selectCorp = cast(player.popWaitingFor(), SelectCard<ICard>);
    const index = selectCorp.cards.findIndex((card) => card.name === CardName.TERRALABS_RESEARCH);
    selectCorp.cb([selectCorp.cards[index]]); // Terralabs
    expect(player.cardCost).to.eq(1);
  });

  it('Works with Polyphemos played via Merger', () => {
    player.corporations = [new BeginnerCorporation()];
    merger.play(player);
    runAllActions(game);

    const selectCorp = cast(player.popWaitingFor(), SelectCard<ICard>);
    const index = selectCorp.cards.findIndex((card) => card.name === CardName.POLYPHEMOS);
    selectCorp.cb([selectCorp.cards[index]]); // Polyphemos
    expect(player.cardCost).to.eq(5);
  });

  it('Works with both Terralabs and Polyphemos together', () => {
    player.playCorporationCard(new Polyphemos());
    expect(player.cardCost).eq(5);
    player.playAdditionalCorporationCard(new TerralabsResearch());
    expect(player.cardCost).eq(3);

    player.corporations = [];

    player.playCorporationCard(new TerralabsResearch());
    expect(player.cardCost).eq(1);
    player.playAdditionalCorporationCard(new Polyphemos());
    expect(player.cardCost).eq(3);
  });

  // Same behavior should apply to Polyphemos.
  it('Works with Terralabs first', () => {
    player.playCorporationCard(new TerralabsResearch());
    player.megaCredits = 50; // Ensure enough to pay for Merger cost
    merger.play(player);
    expect(player.cardCost).to.eq(1);
    runAllActions(game);

    const selectCorp = cast(player.popWaitingFor(), SelectCard<ICard>);
    selectCorp.cb([new BeginnerCorporation()]);
    expect(player.cardCost).to.eq(1);
  });

  it('Adds Merger corp initial action to player.pendingInitialActions', () => {
    player.playCorporationCard(new TharsisRepublic());
    expect(player.pendingInitialActions).has.length(1);

    merger.play(player);
    runAllActions(game);

    const selectCorp = cast(player.popWaitingFor(), SelectCard<ICard>);
    const index = selectCorp.cards.findIndex((card) => card.name === CardName.ARCADIAN_COMMUNITIES);
    selectCorp.cb([selectCorp.cards[index]]); // Arcadian
    expect(player.pendingInitialActions).has.length(2);
  });

  it('Works with Point Luna and second corp with Earth tag', () => {
    player.playCorporationCard(new PointLuna());
    const handSize = player.cardsInHand.length;

    player.playAdditionalCorporationCard(new Teractor());
    game.deferredActions.runAll(() => {});
    expect(player.cardsInHand.length).to.eq(handSize + 1);
  });

  it('Playing next corp card does not charge for cards', () => {
    const helion = new Helion();
    player.cardsInHand = [new MicroMills(), new Asteroid()];
    player.playCorporationCard(helion);
    expect(player.megaCredits).eq(helion.startingMegaCredits - 6);

    merger.play(player);

    runAllActions(game);

    const selectCorp = cast(player.popWaitingFor(), SelectCard<ICard>);
    const tharsis = new TharsisRepublic();
    selectCorp.cb([tharsis]);

    runAllActions(game);

    expect(player.megaCredits).eq(helion.startingMegaCredits + tharsis.startingMegaCredits - Merger.mergerCost - 6);
  });

  it('Works with Viron and another corporation card', () => {
    const viron = new Viron();
    const septumTribus = new SeptumTribus();
    player.playCorporationCard(viron);
    player.playAdditionalCorporationCard(septumTribus);

    expect(viron.canAct(player)).is.false;
    expect(player.getPlayableActionCards()).deep.eq([septumTribus]);
    player.addActionThisGeneration(septumTribus.name);
    expect(player.getPlayableActionCards()).deep.eq([viron]);
    expect(viron.canAct(player)).is.true;
    const selectCard = cast(viron.action(player), SelectCard);
    expect(selectCard.cards).deep.eq([septumTribus]);
  });


  it('Works with Aridor and another corporation card', () => {
    player.playCorporationCard(new Aridor());
    runAllActions(game);
    expect(player.production.megacredits).eq(0);

    player.playAdditionalCorporationCard(new Viron());
    runAllActions(game);
    expect(player.production.megacredits).eq(1);
  });

  it('Works with Aridor and another corporation card, Aridor goes second', () => {
    player.playCorporationCard(new Viron());
    runAllActions(game);
    expect(player.production.megacredits).eq(0);

    player.playAdditionalCorporationCard(new Aridor());
    runAllActions(game);
    expect(player.production.megacredits).eq(0);

    player.playCard(new Tardigrades());
    runAllActions(game);
    expect(player.production.megacredits).eq(0);
  });

  describe('Mergability outliers for weird cases', () => {
    function testMergability(currentCorp: ICorporationCard | [ICorporationCard, ICorporationCard], candidate: ICorporationCard, megacredits: number, pass: boolean) {
      const corporations = asArray(currentCorp);
      const corpNames = corporations.map((c) => c.name).join(', ');

      it(`(${corpNames}, ${candidate.name}, ${megacredits})`, () => {
        [game, player, player2] = testGame(2, {preludeExtension: true, turmoilExtension: true});
        player.playCorporationCard(corporations[0]);
        if (corporations.length > 1) {
          player.playAdditionalCorporationCard(corporations[1]);
        }
        game.corporationDeck.drawPile.push(candidate);

        player.stock.override(Units.of({megacredits})); // Clear all resources but MC.
        merger.play(player);
        runAllActions(game);

        const selectCorp = cast(player.popWaitingFor(), SelectCard<ICorporationCard>);
        const idx = selectCorp.cards.findIndex((c) => c.name === candidate.name);
        const enabled = selectCorp.config.enabled![idx];
        expect(enabled).eq(pass);
      });
    }

    const beginnerCorp = new BeginnerCorporation();
    const manutech = new Manutech();
    const agricolaInc = new AgricolaInc();
    const lunaTradeFederation = new LunaTradeFederation();
    const projectWorkshop = new ProjectWorkshop();
    const lunaFirstIncorporated = new LunaFirstIncorporated();
    const theGrandLunaCapitalGroup = new TheGrandLunaCapitalGroup();
    const chimera = new Chimera();
    const phobolog = new PhoboLog();
    const pointLuna = new PointLuna();

    // Agricola, Inc: 40MC and 1 MC production.
    testMergability(beginnerCorp, agricolaInc, 1, false);
    testMergability(beginnerCorp, agricolaInc, 2, true);
    testMergability(manutech, agricolaInc, 0, false);
    testMergability(manutech, agricolaInc, 1, true);

    // Project Workshop: 39MC and 1 titanium.
    // Luna Trade Federation: titanium = 2MC each
    testMergability(beginnerCorp, projectWorkshop, 2, false);
    testMergability(beginnerCorp, projectWorkshop, 3, true);
    testMergability(lunaTradeFederation, projectWorkshop, 0, false);
    testMergability(lunaTradeFederation, projectWorkshop, 1, true);

    // Luna First Incorporated: 40MC and 1 titanium.
    testMergability(beginnerCorp, lunaFirstIncorporated, 1, false);
    testMergability(beginnerCorp, lunaFirstIncorporated, 2, true);
    testMergability(lunaTradeFederation, lunaFirstIncorporated, 0, true);

    // The Grand Luna Capital Group: 32MC and 1 titanium
    testMergability(beginnerCorp, theGrandLunaCapitalGroup, 9, false);
    testMergability(beginnerCorp, theGrandLunaCapitalGroup, 10, true);
    testMergability(lunaTradeFederation, theGrandLunaCapitalGroup, 7, false);
    testMergability(lunaTradeFederation, theGrandLunaCapitalGroup, 8, true);

    // Chimera: 36MC and 1 titanium
    testMergability(beginnerCorp, chimera, 5, false);
    testMergability(beginnerCorp, chimera, 6, true);
    testMergability(lunaTradeFederation, chimera, 3, false);
    testMergability(lunaTradeFederation, chimera, 4, true);

    // Luna Trade Federation: 15MC and 10 titanium
    testMergability(beginnerCorp, lunaTradeFederation, 6, false);
    testMergability(beginnerCorp, lunaTradeFederation, 7, true);

    // Phobolog: 23 MC, 10 titanium and +1 titanium value.
    testMergability(beginnerCorp, phobolog, 0, false);
    testMergability(lunaTradeFederation, phobolog, 0, true);
    testMergability(phobolog, lunaTradeFederation, 0, true);

    // Point Luna: 38MC 1 titanium production.
    testMergability(beginnerCorp, pointLuna, 3, false);
    testMergability(beginnerCorp, pointLuna, 4, true);
    testMergability(lunaTradeFederation, pointLuna, 3, false);
    testMergability(lunaTradeFederation, pointLuna, 4, true);
    // Combo. The titanium production provides 2 more MC.
    testMergability([lunaTradeFederation, manutech], pointLuna, 1, false);
    testMergability([lunaTradeFederation, manutech], pointLuna, 3, true);

    // Robin Haulings: 39MC, add 1 floater to any card. (Helion + X)
  });

  it('All corporation first actions count as a single action', () => {
    const [game, player, player2] = testGame(2, {venusNextExtension: true});
    const inventrix = new Inventrix(); // Draw 3 cards
    const ambient = new Ambient(); // Raise venus 2 steps
    player.playCorporationCard(inventrix);
    player.playAdditionalCorporationCard(ambient);

    expect(player.pendingInitialActions).has.length(2);
    expect(player.actionsTakenThisRound).eq(0);

    player.takeAction();
    const firstAction = cast(player.getWaitingFor(), OrOptions);

    expect(firstAction.options).has.length(3);
    expect(firstAction.options[0].buttonLabel).contains('Draw 3 cards');
    expect(firstAction.options[1].buttonLabel).contains('Raise the Venus scale');

    player.process({type: 'or', index: 0, response: {type: 'option'}});

    expect(player.cardsInHand).has.length(3);
    expect(player.pendingInitialActions).has.length(1);

    // Still hasn't completed an action this round,
    expect(player.actionsTakenThisRound).eq(0);

    const secondAction = cast(player.getWaitingFor(), OrOptions);

    expect(secondAction.options).has.length(2);
    expect(secondAction.options[0].buttonLabel).contains('Raise the Venus scale');

    player.process({type: 'or', index: 0, response: {type: 'option'}});

    expect(player.cardsInHand).has.length(3);
    expect(game.getVenusScaleLevel()).eq(4);
    expect(player.pendingInitialActions).has.length(0);

    // Completed both first actions, which is one action.
    expect(player.actionsTakenThisRound).eq(1);

    // first player is still active player;
    expect(game.activePlayer).eq(player.id);
    expect(player.getWaitingFor()).is.not.undefined;
    expect(player2.getWaitingFor()).is.undefined;
  });
});
