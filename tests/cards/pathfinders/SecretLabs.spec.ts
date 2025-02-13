import {expect} from 'chai';
import {SecretLabs} from '../../../src/server/cards/pathfinders/SecretLabs';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {TestPlayer} from '../../TestPlayer';
import {cast, maxOutOceans, runAllActions} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {GHGProducingBacteria} from '../../../src/server/cards/base/GHGProducingBacteria';
import {assertPlaceOcean} from '../../assertions';
import {Whales} from '../../../src/server/cards/underworld/Whales';

describe('SecretLabs', () => {
  let card: SecretLabs;
  let player: TestPlayer;
  let microbeCard: IProjectCard;
  let floaterCard: IProjectCard;

  beforeEach(() => {
    card = new SecretLabs();
    [/* game */, player] = testGame(1);
    microbeCard = new GHGProducingBacteria();
    floaterCard = new JovianLanterns();
    player.playedCards = [microbeCard, floaterCard];
  });

  it('canPlay', () => {
    player.megaCredits = card.cost;
    player.tagsForTest = {jovian: 1, science: 1};
    expect(player.canPlay(card)).is.true;

    player.tagsForTest = {jovian: 1, science: 0};
    expect(player.canPlay(card)).is.false;

    player.tagsForTest = {jovian: 0, science: 1};
    expect(player.canPlay(card)).is.false;
  });

  it('play - place an ocean tile', () => {
    const orOptions = cast(card.play(player), OrOptions);
    const placeOcean = orOptions.options[0];

    placeOcean.cb();
    runAllActions(player.game);

    assertPlaceOcean(player, player.popWaitingFor());

    runAllActions(player.game);
    expect(microbeCard.resourceCount).eq(2);
  });

  it('play - raise temperature', () => {
    const orOptions = cast(card.play(player), OrOptions);
    const raiseTemperature = orOptions.options[1];

    expect(player.game.getTemperature()).eq(-30);

    raiseTemperature.cb();
    runAllActions(player.game);

    expect(player.game.getTemperature()).eq(-28);
    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 3}));
  });

  it('play - raise oxygen', () => {
    const orOptions = cast(card.play(player), OrOptions);
    const raiseOxygen = orOptions.options[2];

    expect(player.game.getOxygenLevel()).eq(0);

    raiseOxygen.cb();
    runAllActions(player.game);

    expect(player.game.getOxygenLevel()).eq(1);
    expect(floaterCard.resourceCount).eq(2);
  });

  it('play - available if oceans are maxed out', () => {
    player.megaCredits = card.cost;
    player.tagsForTest = {jovian: 1, science: 1};
    maxOutOceans(player);
    const orOptions = cast(card.play(player), OrOptions);
    expect(orOptions.options).has.length(3);
    expect(orOptions.options[0].title).eq('Add 2 microbes to ANY card.');
  });

  it('play, triggers Whales', () => {
    const whales = new Whales();
    player.playedCards.push(whales);
    player.megaCredits = card.cost;
    player.tagsForTest = {jovian: 1, science: 1};
    maxOutOceans(player);
    const orOptions = cast(card.play(player), OrOptions);
    expect(orOptions.options[0].title).eq('Add 2 microbes to ANY card.');
    const tr = player.getTerraformRating();
    cast(orOptions.options[0].cb(), undefined);
    runAllActions(player.game);
    expect(player.getTerraformRating()).eq(tr);
    expect(whales.resourceCount).eq(1);
  });
});
