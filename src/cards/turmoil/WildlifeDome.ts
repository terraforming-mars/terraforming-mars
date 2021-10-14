import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PartyName} from '../../turmoil/parties/PartyName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class WildlifeDome extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.WILDLIFE_DOME,
      cost: 15,
      tags: [Tags.ANIMAL, Tags.PLANT, Tags.BUILDING],
      cardType: CardType.AUTOMATED,
      requirements: CardRequirements.builder((b) => b.party(PartyName.GREENS)),
      tr: {oxygen: 1},

      metadata: {
        cardNumber: 'T15',
        renderData: CardRenderer.builder((b) => {
          b.greenery();
        }),
        description: 'Requires that Greens are ruling or that you have 2 delegates there. Place a greenery tile and raise oxygen 1 step.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesForGreenery(player).length > 0;
  }

  public play(player: Player) {
    return new SelectSpace('Select space for greenery tile', player.game.board.getAvailableSpacesForGreenery(player), (space: ISpace) => {
      return player.game.addGreenery(player, space.id);
    });
  }
}
