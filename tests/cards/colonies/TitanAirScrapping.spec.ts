import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {TitanAirScrapping} from '../../../src/server/cards/colonies/TitanAirScrapping';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('TitanAirScrapping', function() {
  let card: TitanAirScrapping;
  let player: Player;

  beforeEach(function() {
    card = new TitanAirScrapping();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not act', function() {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act - both actions possible', function() {
    player.playedCards.push(card);
    player.titanium = 3;
    player.addResourceTo(card, 7);
    expect(card.canAct(player)).is.true;

    const orOptions = cast(card.action(player), OrOptions);
    orOptions.options[0].cb();

    expect(player.getTerraformRating()).to.eq(21);
    expect(card.resourceCount).to.eq(5);
    expect(card.getVictoryPoints()).to.eq(2);
  });

  it('Should act automatically when only one action possible', function() {
    player.playedCards.push(card);
    player.addResourceTo(card, 2);
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.getTerraformRating()).to.eq(21);
    expect(card.resourceCount).to.eq(0);
  });
});
