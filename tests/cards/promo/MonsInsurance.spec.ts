import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {Sabotage} from '../../../src/cards/base/Sabotage';
import {Tardigrades} from '../../../src/cards/base/Tardigrades';
import {MonsInsurance} from '../../../src/cards/promo/MonsInsurance';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('MonsInsurance', function() {
  let card : MonsInsurance; let player : Player; let player2: Player; let player3: Player;

  beforeEach(function() {
    card = new MonsInsurance();

    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    player3 = TestPlayers.GREEN.newPlayer();
    Game.newInstance('foobar', [player, player2, player3], player);
  });

  it('Should play', function() {
    const play = card.play(player);
    expect(play).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
    expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(-2);
    expect(player3.getProduction(Resources.MEGACREDITS)).to.eq(-2);
  });

  it('Triggers effect when resources are removed', function() {
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

  it('Doesn\'t trigger effect when player removes resources from self', function() {
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

  it('Doesn\'t trigger effect when player should pay itself', function() {
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
});
