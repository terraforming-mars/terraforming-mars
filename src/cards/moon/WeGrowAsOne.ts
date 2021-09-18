import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {all} from '../Options';

export class WeGrowAsOne extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.WE_GROW_AS_ONE,
      cardType: CardType.EVENT,
      tags: [Tags.SPACE],
      cost: 8,
      requirements: CardRequirements.builder((b) => b.party(PartyName.UNITY)),

      metadata: {
        description: 'Requires that Unity are ruling or that you have 2 delegates there. ' +
        'Increase ALL Colony Tile Tracks 1 step. ' +
        'Increase each Colony Tile Track 1 step if you have a colony on that Colony Tile.',
        cardNumber: 'M59',
        renderData: CardRenderer.builder((b) => {
          b.placeColony({all}).text('+1').br;
          b.colonies(1).asterix().slash().placeColony().text('+1');
        }),
      },
    });
  };

  public play(player: Player) {
    player.game.colonies.forEach((colony) => {
      if (colony.colonies.includes(player.id)) {
        colony.increaseTrack(2);
      } else {
        colony.increaseTrack(1);
      }
    });
    return undefined;
  }
}
