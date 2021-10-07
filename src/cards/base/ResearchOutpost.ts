import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {PlayerInput} from '../../PlayerInput';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {nextToNoOtherTileFn} from '../../boards/Board';

export class ResearchOutpost extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.RESEARCH_OUTPOST,
      tags: [Tags.SCIENCE, Tags.CITY, Tags.BUILDING],
      cost: 18,

      cardDiscount: {amount: 1},
      metadata: {
        cardNumber: '020',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a card, you pay 1 M€ less for it.', (eb) => {
            eb.empty().startEffect.megacredits(-1);
          }).br;
          b.city();
        }),
        description: 'Place a city tile NEXT TO NO OTHER TILE.',
      },
    });
  }
  private getAvailableSpaces(player: Player): Array<ISpace> {
    return player.game.board.getAvailableSpacesOnLand(player)
      .filter(nextToNoOtherTileFn(player.game.board));
  }
  public canPlay(player: Player): boolean {
    return this.getAvailableSpaces(player).length > 0;
  }


  public getCardDiscount() {
    return 1;
  }
  public play(player: Player): PlayerInput {
    return new SelectSpace('Select place next to no other tile for city', this.getAvailableSpaces(player), (foundSpace: ISpace) => {
      player.game.addCityTile(player, foundSpace.id);
      return undefined;
    });
  }
}
