import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {Sabotage} from '../../../src/cards/base/Sabotage';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {MonsInsurance} from '../../../src/cards/promo/MonsInsurance';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/Resources';
import {GlobalEventName} from '../../../src/turmoil/globalEvents/GlobalEventName';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('MonsInsurance', () => {
  let card: MonsInsurance; let player: TestPlayer; let player2: TestPlayer; let player3: TestPlayer;

  beforeEach(() => {
    card = new MonsInsurance();

    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    player3 = TestPlayers.GREEN.newPlayer();
    Game.newInstance('foobar', [player, player2, player3], player);
  });

  it('Should play', () => {
    const play = card.play(player);
    expect(play).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(-2);
    expect(player3.getProduction(Resources.MEGACREDITS)).to.eq(-2);
  });

  it('Triggers effect when resources are removed', () => {
    card.play(player);
    player.corporationCard = card;
    player.megaCredits = 2;
    player2.titanium = 3;

    const card2 = new Sabotage();
    const action = card2.play!(player3) as OrOptions;

    action.options[1].cb();
    expect(player2.titanium).to.eq(0);
    expect(player2.megaCredits).to.eq(2);
    expect(player.megaCredits).to.eq(0);
  });

  it('Does not trigger effect when player removes resources from self', () => {
    card.play(player);
    player.corporationCard = card;
    player.megaCredits = 2;

    const ants = new Ants();
    const tardigrades = new Tardigrades();
    player2.playedCards.push(ants, tardigrades);
    tardigrades.resourceCount = 3;

    ants.action(player2); // remove resource from own card
    expect(player2.megaCredits).to.eq(0);
    expect(player.megaCredits).to.eq(2);
  });

  it('Does not trigger effect when player should pay itself', () => {
    card.play(player);
    player.corporationCard = card;
    player.megaCredits = 2;

    const tardigrades = new Tardigrades();
    player.playedCards.push(tardigrades);
    tardigrades.resourceCount = 3;

    const ants = new Ants();
    player2.playedCards.push(ants);

    ants.action(player2); // remove resource from Mons' card
    expect(player2.megaCredits).to.eq(0);
    expect(player.megaCredits).to.eq(2);
  });

  it('Effect triggers direct calls to addResource', () => {
    card.play(player);
    player.corporationCard = card;
    player.megaCredits = 10;
    player2.megaCredits = 10;
    player2.steel = 1;

    player2.addResource(Resources.STEEL, -1, {log: false, from: player3});

    expect(player2.megaCredits).to.eq(13);
    expect(player.megaCredits).to.eq(7);
  });

  it('Effect does not trigger direct calls to addResource for Global Event', () => {
    card.play(player);
    player.corporationCard = card;
    player.megaCredits = 10;
    player2.megaCredits = 10;
    player2.steel = 1;

    player2.addResource(Resources.STEEL, -1, {log: false, from: GlobalEventName.ECO_SABOTAGE});

    expect(player2.megaCredits).to.eq(10);
    expect(player.megaCredits).to.eq(10);
  });

  it('Effect triggers direct calls to addProduction', () => {
    card.play(player);
    player.corporationCard = card;
    player.setProductionForTest({megacredits: 1});
    player.megaCredits = 10;
    player2.megaCredits = 10;

    player2.addProduction(Resources.MEGACREDITS, -1, {log: false, from: player3});

    expect(player2.megaCredits).to.eq(13);
    expect(player.megaCredits).to.eq(7);
  });

  it('Effect does not trigger direct calls to addProduction for Global Event', () => {
    card.play(player);
    player.corporationCard = card;
    player.setProductionForTest({megacredits: 1});
    player.megaCredits = 10;
    player2.megaCredits = 10;

    player2.addProduction(Resources.MEGACREDITS, -1, {log: false, from: GlobalEventName.ECO_SABOTAGE});

    expect(player2.megaCredits).to.eq(10);
    expect(player.megaCredits).to.eq(10);
  });
});
