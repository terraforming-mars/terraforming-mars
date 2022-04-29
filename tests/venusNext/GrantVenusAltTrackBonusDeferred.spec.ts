import {expect} from 'chai';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {GrantVenusAltTrackBonusDeferred} from '../../src/venusNext/GrantVenusAltTrackBonusDeferred';
import {AndOptions} from '../../src/inputs/AndOptions';
import {TestingUtils} from '../TestingUtils';
import {Tardigrades} from '../../src/cards/base/Tardigrades';
import {OrOptions} from '../../src/inputs/OrOptions';
import {SelectCard} from '../../src/inputs/SelectCard';
import {Birds} from '../../src/cards/base/Birds';

describe('GrantVenusAltTrackBonusDeferred', function() {
  let player: Player;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('x', [player], player);
  });

  it('grant single bonus', () => {
    const input = TestingUtils.cast(new GrantVenusAltTrackBonusDeferred(player, 1, false).execute(), AndOptions);
    input.options[0].cb(0);
    input.options[1].cb(0);
    input.options[2].cb(0);
    input.options[3].cb(0);
    input.options[4].cb(0);
    input.options[5].cb(1);
    input.cb();
    expect(player.megaCredits).eq(0);
    expect(player.steel).eq(0);
    expect(player.titanium).eq(0);
    expect(player.plants).eq(0);
    expect(player.energy).eq(0);
    expect(player.heat).eq(1);
  });

  it('reject too many bonuses', () => {
    const input = TestingUtils.cast(new GrantVenusAltTrackBonusDeferred(player, 2, false).execute(), AndOptions);
    input.options[0].cb(0);
    input.options[0].cb(0);
    input.options[0].cb(0);
    input.options[0].cb(0);
    input.options[0].cb(0);
    input.options[5].cb(3);

    expect(() => input.cb()).to.throw('Select 2 resources.');

    player.heat = 0;
    input.options[5].cb(2);
    input.cb();
    expect(player.heat).eq(2);
  });

  it('grants wild resource', () => {
    // If the player had a resource card, the deferred action would return OrOption
    TestingUtils.cast(new GrantVenusAltTrackBonusDeferred(player, 0, true).execute(), AndOptions);

    const card = new Tardigrades();
    const otherCard = new Birds();
    player.playedCards.push(otherCard, card);

    const input = TestingUtils.cast(new GrantVenusAltTrackBonusDeferred(player, 0, true).execute(), OrOptions);
    const selectCard = TestingUtils.cast(input.options[0], SelectCard);
    expect(selectCard.cards).has.length(2);
    expect(card.resourceCount).eq(0);
    selectCard.cb([card]);
    expect(card.resourceCount).eq(1);

    // The second option is the standard resource section.
    expect(input.options[1]).instanceof(AndOptions);
  });
});
