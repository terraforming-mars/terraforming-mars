import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class FieldCappedCity implements IProjectCard {
    public cost = 29;
    public tags = [Tags.CITY, Tags.BUILDING, Tags.ENERGY];
    public name = CardName.FIELD_CAPPED_CITY;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      return game.board.getAvailableSpacesForCity(player).length > 0;
    }

    public play(player: Player, game: Game) {
      return new SelectSpace(
        'Select space for city tile',
        game.board.getAvailableSpacesForCity(player),
        (space: ISpace) => {
          game.addCityTile(player, space.id);
          player.plants += 3;
          player.addProduction(Resources.ENERGY, 1);
          player.addProduction(Resources.MEGACREDITS, 2);
          return undefined;
        },
      );
    }
    public metadata: CardMetadata = {
      cardNumber: 'X19',
      description: 'Increase your MC production 2 steps, increase your energy production 1 step, gain 3 plants, and place a city tile.',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.megacredits(2).br;
          pb.energy(1);
        }).nbsp.city().br;
        b.plants(3);
      }),
    }
}
