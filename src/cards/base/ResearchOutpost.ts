import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {PlayerInput} from '../../PlayerInput';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class ResearchOutpost implements IProjectCard {
    public cost = 18;
    public tags = [Tags.SCIENCE, Tags.CITY, Tags.BUILDING];
    public name = CardName.RESEARCH_OUTPOST;
    public cardType = CardType.ACTIVE;
    public hasRequirements = false;
    private getAvailableSpaces(player: Player, game: Game): Array<ISpace> {
      return game.board.getAvailableSpacesOnLand(player)
        .filter((space) => {
          const adjacentSpaces = game.board.getAdjacentSpaces(space);
          return adjacentSpaces.filter((space) => space.tile !== undefined).length === 0;
        });
    }
    public canPlay(player: Player, game: Game): boolean {
      return this.getAvailableSpaces(player, game).length > 0;
    }
    public getCardDiscount() {
      return 1;
    }
    public play(player: Player, game: Game): PlayerInput {
      return new SelectSpace('Select place next to no other tile for city', this.getAvailableSpaces(player, game), (foundSpace: ISpace) => {
        game.addCityTile(player, foundSpace.id);
        return undefined;
      });
    }
    public metadata: CardMetadata = {
      cardNumber: '020',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.empty().startEffect.megacredits(-1);
          eb.description('Effect: When you play a card, you pay 1 MC less for it.');
        }).br;
        b.city();
      }),
      description: 'Place a city tile NEXT TO NO OTHER TILE.',
    }
}
