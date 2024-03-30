import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Sabotage} from '../../../src/server/cards/base/Sabotage';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {AirRaid} from '../../../src/server/cards/colonies/AirRaid';
import {Birds} from '../../../src/server/cards/base/Birds';
import {MonsInsurance} from '../../../src/server/cards/promo/MonsInsurance';
import {DeimosDown} from '../../../src/server/cards/base/DeimosDown';
import {Predators} from '../../../src/server/cards/base/Predators';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Resource} from '../../../src/common/Resource';
import {GlobalEventName} from '../../../src/common/turmoil/globalEvents/GlobalEventName';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('MonsInsurance', () => {
  let card: MonsInsurance;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;

  beforeEach(() => {
    card = new MonsInsurance();

    [/* game */, player, player2, player3] = testGame(3);
    card.play(player);
    player.setCorporationForTest(card);
  });

  it('Should play', () => {
    expect(player.production.megacredits).to.eq(4);
    expect(player2.production.megacredits).to.eq(-2);
    expect(player3.production.megacredits).to.eq(-2);
  });

  it('Triggers effect when resources are removed', () => {
    player.stock.megacredits = 2;
    player2.stock.titanium = 3;

    const card2 = new Sabotage();
    const action = cast(card2.play(player3), OrOptions);

    action.options[1].cb();
    expect(player2.stock.titanium).to.eq(0);
    expect(player2.stock.megacredits).to.eq(2);
    expect(player.stock.megacredits).to.eq(0);
  });

  it('Does not trigger effect when player removes resources from self', () => {
    player.stock.megacredits = 2;

    const ants = new Ants();
    const tardigrades = new Tardigrades();
    player2.playedCards.push(ants, tardigrades);
    tardigrades.resourceCount = 3;

    ants.action(player2); // remove resource from own card
    expect(player2.stock.megacredits).to.eq(0);
    expect(player.stock.megacredits).to.eq(2);
  });

  it('Does not trigger effect when player should pay itself', () => {
    player.stock.megacredits = 2;

    const tardigrades = new Tardigrades();
    player.playedCards.push(tardigrades);
    tardigrades.resourceCount = 3;

    const ants = new Ants();
    player2.playedCards.push(ants);

    ants.action(player2); // remove resource from Mons' card
    expect(player2.stock.megacredits).to.eq(0);
    expect(player.stock.megacredits).to.eq(2);
  });

  it('Effect triggers direct calls to addResource', () => {
    player.stock.megacredits = 10;
    player2.stock.megacredits = 10;
    player2.stock.steel = 1;

    player2.stock.add(Resource.STEEL, -1, {log: false, from: player3});

    expect(player2.stock.megacredits).to.eq(13);
    expect(player.stock.megacredits).to.eq(7);
  });

  it('Effect does not trigger direct calls to addResource for Global Event', () => {
    player.stock.megacredits = 10;
    player2.stock.megacredits = 10;
    player2.stock.steel = 1;

    player2.stock.add(Resource.STEEL, -1, {log: false, from: GlobalEventName.ECO_SABOTAGE});

    expect(player2.stock.megacredits).to.eq(10);
    expect(player.stock.megacredits).to.eq(10);
  });

  it('Effect triggers direct calls to addProduction', () => {
    player.production.override({megacredits: 1});
    player.stock.megacredits = 10;
    player2.stock.megacredits = 10;

    player2.production.add(Resource.MEGACREDITS, -1, {log: false, from: player3});

    expect(player2.stock.megacredits).to.eq(13);
    expect(player.stock.megacredits).to.eq(7);
  });

  it('Effect does not trigger direct calls to addProduction for Global Event', () => {
    player.production.override({megacredits: 1});
    player.stock.megacredits = 10;
    player2.stock.megacredits = 10;

    player2.production.add(Resource.MEGACREDITS, -1, {log: false, from: GlobalEventName.ECO_SABOTAGE});

    expect(player2.stock.megacredits).to.eq(10);
    expect(player.stock.megacredits).to.eq(10);
  });
});

describe('MonsInsurance - Solo', () => {
  let card: MonsInsurance;
  let player: TestPlayer;

  beforeEach(() => {
    card = new MonsInsurance();

    [/* game */, player] = testGame(1, {preludeExtension: true});
    card.play(player);
    player.setCorporationForTest(card);
  });

  it('Should play', () => {
    expect(player.production.megacredits).to.eq(4);
  });

  it('Triggers on StealResources', () => {
    player.stock.megacredits = 10;

    // AirRaid steals 5 resources from any player.
    const airRaid = new AirRaid();
    airRaid.play(player);
    runAllActions(player.game);
    cast(player.getWaitingFor(), undefined);

    // 10 + 5 - 3 = 12
    expect(player.stock.megacredits).eq(12);
  });

  it('Triggers on DecreaseAnyProduction', () => {
    player.stock.megacredits = 10;

    // Birds removes 2 plant production
    const birds = new Birds();
    birds.play(player);
    runAllActions(player.game);
    cast(player.getWaitingFor(), undefined);

    expect(player.stock.megacredits).eq(7);
  });

  it('Triggers on RemoveAnyPlants', () => {
    player.stock.megacredits = 10;

    // DeimosDown removes 8 plants from any palyer
    const comet = new DeimosDown();

    comet.play(player);
    runAllActions(player.game);
    cast(player.getWaitingFor(), undefined);

    expect(player.stock.megacredits).eq(7);
  });

  it('Triggers on RemoveResourcesFromCard', () => {
    player.stock.megacredits = 10;

    // Predators steals one animal from another player
    const predators = new Predators();
    player.playedCards = [predators];
    expect(predators.resourceCount).eq(0);

    predators.action(player);
    runAllActions(player.game);
    cast(player.getWaitingFor(), undefined);

    expect(predators.resourceCount).eq(1);
    expect(player.stock.megacredits).eq(7);
  });
});
