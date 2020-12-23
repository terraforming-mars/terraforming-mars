import {expect} from 'chai';
import {TitanAirScrapping} from '../../../src/cards/colonies/TitanAirScrapping';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('TitanAirScrapping', function() {
  let card : TitanAirScrapping; let player : Player; let game : Game;

  beforeEach(function() {
    card = new TitanAirScrapping();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t act', function() {
    player.playedCards.push(card);
    expect(card.canAct(player, game)).is.not.true;
  });

  it('Should act - both actions possible', function() {
    player.playedCards.push(card);
    player.titanium = 3;
    player.addResourceTo(card, 7);
    expect(card.canAct(player, game)).is.true;

    const orOptions = card.action(player, game) as OrOptions;
    expect(orOptions instanceof OrOptions).is.true;
        orOptions!.options[0].cb();

        expect(player.getTerraformRating()).to.eq(21);
        expect(player.getResourcesOnCard(card)).to.eq(5);
        expect(card.getVictoryPoints()).to.eq(2);
  });

  it('Should act automatically when only one action possible', function() {
    player.playedCards.push(card);
    player.addResourceTo(card, 2);
    expect(card.canAct(player, game)).is.true;

    card.action(player, game);
    expect(player.getTerraformRating()).to.eq(21);
    expect(player.getResourcesOnCard(card)).to.eq(0);
  });
});
