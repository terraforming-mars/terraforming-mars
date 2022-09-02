import {expect} from 'chai';
import {SecretLabs} from '../../../src/server/cards/pathfinders/SecretLabs';
import {Game} from '../../../src/server/Game';
import {Units} from '../../../src/common/Units';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {GHGProducingBacteria} from '../../../src/server/cards/base/GHGProducingBacteria';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('SecretLabs', function() {
  let card: SecretLabs;
  let player: TestPlayer;
  let microbeCard: IProjectCard;
  let floaterCard: IProjectCard;

  beforeEach(function() {
    card = new SecretLabs();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
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
    const options = cast(card.play(player), OrOptions);
    const placeOcean = options.options[0];

    placeOcean.cb();
    runAllActions(player.game);

    const selectSpace = cast(player.getWaitingFor(), SelectSpace);
    expect(selectSpace.availableSpaces[0].tile).is.undefined;

    selectSpace.cb(selectSpace.availableSpaces[0]);

    runAllActions(player.game);

    expect(selectSpace.availableSpaces[0].tile!.tileType).eq(TileType.OCEAN);
    expect(microbeCard.resourceCount).eq(2);
  });

  it('play - raise temperature', function() {
    const options = cast(card.play(player), OrOptions);
    const raiseTemperature = options.options[1];

    expect(player.game.getTemperature()).eq(-30);

    raiseTemperature.cb();
    runAllActions(player.game);

    expect(player.game.getTemperature()).eq(-28);
    expect(player.getResourcesForTest()).deep.eq(Units.of({plants: 3}));
  });

  it('play - raise oxygen', function() {
    const options = cast(card.play(player), OrOptions);
    const raiseOxygen = options.options[2];

    expect(player.game.getOxygenLevel()).eq(0);

    raiseOxygen.cb();
    runAllActions(player.game);

    expect(player.game.getOxygenLevel()).eq(1);
    expect(floaterCard.resourceCount).eq(2);
  });
});
