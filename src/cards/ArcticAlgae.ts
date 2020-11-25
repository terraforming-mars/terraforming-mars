import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {ISpace} from '../ISpace';
import {TileType} from '../TileType';
import {CardName} from '../CardName';
import {CardMetadata} from './CardMetadata';
import {CardRequirements} from './CardRequirements';
import {CardRenderer} from './render/CardRenderer';

export class ArcticAlgae implements IProjectCard {
  public cost = 12;
  public tags = [Tags.PLANT];
  public name = CardName.ARCTIC_ALGAE;
  public cardType = CardType.ACTIVE;
  public canPlay(player: Player, game: Game): boolean {
    return game.getTemperature() <= -12 + player.getRequirementsBonus(game) * 2;
  }
  public onTilePlaced(player: Player, space: ISpace) {
    if (space.tile !== undefined && space.tile.tileType === TileType.OCEAN) {
      player.plants += 2;
    }
  }
  public play(player: Player) {
    player.plants++;
    return undefined;
  }

  public metadata: CardMetadata = {
    description: 'It must be -12 C or colder to play. Gain 1 plant',
    cardNumber: '023',
    requirements: CardRequirements.builder((b) => b.temperature(-12).max()),
    renderData: CardRenderer.builder((b) => {
      b.effectBox((be) => be.oceans(1).any.startEffect.plants(2).description('Effect: When anyone places an ocean tile, gain 2 plants')).br;
      b.plants(1);
    }),
  };
}
