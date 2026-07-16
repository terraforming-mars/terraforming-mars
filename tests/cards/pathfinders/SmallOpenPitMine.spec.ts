import {expect} from 'chai';
import {SmallOpenPitMine} from '../../../src/server/cards/pathfinders/SmallOpenPitMine';
import {Units} from '../../../src/common/Units';
import {TestPlayer} from '../../TestPlayer';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {GHGProducingBacteria} from '../../../src/server/cards/base/GHGProducingBacteria';
import {cast, testGame} from '../../TestingUtils';

describe('SmallOpenPitMine', () => {
  let card: SmallOpenPitMine;
  let player: TestPlayer;
  let microbeCard: IProjectCard;
  let floaterCard: IProjectCard;

  beforeEach(() => {
    card = new SmallOpenPitMine();
    [/* game */, player] = testGame(1);

    microbeCard = new GHGProducingBacteria();
    floaterCard = new JovianLanterns();
    player.playedCards.push(microbeCard, floaterCard);
  });

  it('play - steel', () => {
    card.play(player);
    const options = cast(player.game.deferredActions.pop()?.execute(), OrOptions);
    const twoSteel = options.options[0];

    twoSteel.cb();

    expect(player.production.asUnits()).deep.eq(Units.of({steel: 2}));
  });

  it('play - titanium', () => {
    card.play(player);
    const options = cast(player.game.deferredActions.pop()?.execute(), OrOptions);
    const oneTitanium = options.options[1];

    oneTitanium.cb();

    expect(player.production.asUnits()).deep.eq(Units.of({titanium: 1}));
  });
});
