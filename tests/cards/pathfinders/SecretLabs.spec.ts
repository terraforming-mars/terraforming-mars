import {expect} from 'chai';
import {SecretLabs} from '../../../src/cards/pathfinders/SecretLabs';
import {Game} from '../../../src/Game';
import {Units} from '../../../src/common/Units';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {JovianLanterns} from '../../../src/cards/colonies/JovianLanterns';
import {GHGProducingBacteria} from '../../../src/cards/base/GHGProducingBacteria';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('SecretLabs', function() {
  let card: SecretLabs;
  let player: TestPlayer;
  let microbeCard: IProjectCard;
  let floaterCard: IProjectCard;

  beforeEach(function() {
    card = new SecretLabs();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    microbeCard = new GHGProducingBacteria();
    floaterCard = new JovianLanterns();
    player.playedCards = [microbeCard, floaterCard];
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    player.tagsForTest = {jovian: 1, science: 1};
    expect(player.canPlay(card)).is.true;

    player.tagsForTest = {jovian: 1, science: 0};
    expect(player.canPlay(card)).is.false;


    player.tagsForTest = {jovian: 0, science: 1};
    expect(player.canPlay(card)).is.false;
  });

  it('play - place an ocean tile', function() {
    const options = card.play(player) as OrOptions;
    const placeOcean = options.options[0];

    placeOcean.cb();
    TestingUtils.runAllActions(player.game);

    const selectSpace = player.getWaitingFor() as SelectSpace;
    expect(selectSpace.availableSpaces[0].tile).is.undefined;

    selectSpace.cb(selectSpace.availableSpaces[0]);

    TestingUtils.runAllActions(player.game);

    expect(selectSpace.availableSpaces[0].tile!.tileType).eq(TileType.OCEAN);
    expect(microbeCard.resourceCount).eq(2);
  });

  it('play - raise temperature', function() {
    const options = card.play(player) as OrOptions;
    const raiseTemperature = options.options[1];

    expect(player.game.getTemperature()).eq(-30);

    raiseTemperature.cb();
    TestingUtils.runAllActions(player.game);

    expect(player.game.getTemperature()).eq(-28);
    expect(player.getResourcesForTest()).deep.eq(Units.of({plants: 3}));
  });

  it('play - raise oxygen', function() {
    const options = card.play(player) as OrOptions;
    const raiseOxygen = options.options[2];

    expect(player.game.getOxygenLevel()).eq(0);

    raiseOxygen.cb();
    TestingUtils.runAllActions(player.game);

    expect(player.game.getOxygenLevel()).eq(1);
    expect(floaterCard.resourceCount).eq(2);
  });
});
