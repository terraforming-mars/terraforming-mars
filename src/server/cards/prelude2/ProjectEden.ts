import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../../server/IPlayer';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {SelectOption} from '../../inputs/SelectOption';
import {PlaceGreeneryTile} from '../../deferredActions/PlaceGreeneryTile';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {OrOptions} from '../../inputs/OrOptions';
import {DiscardCards} from '../../deferredActions/DiscardCards';

export class ProjectEden extends PreludeCard {
  constructor() {
    super({
      name: CardName.PROJECT_EDEN,
      tags: [Tag.CITY, Tag.PLANT],
      tr: {oceans: 1, oxygen: 1},

      metadata: {
        cardNumber: 'P58',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1).city().greenery().text('-3').cards(1);
        }),
        description: 'Place 1 ocean tile, 1 city tile, and 1 greenery tile. Discard 3 cards.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    if (player.cardsInHand.length >= 3 && player.canAfford({cost: 0, tr: {oceans: 1, oxygen: 1}})) {
      if (!player.game.canAddOcean()) {
        this.warnings.add('maxoceans');
      }
      return true;
    }
    return false;
  }

  private selected: Array<'ocean' | 'city' | 'greenery' | 'discard'> = [];
  private selectNextAction(player: IPlayer): void {
    const options: Array<SelectOption> = [];

    if (!player.game.canAddOcean()) {
      this.selected.push('ocean');
    }
    if (!this.selected.includes('ocean')) {
      options.push(
        new SelectOption('Place an ocean').andThen(() => {
          this.selected.push('ocean');
          player.game
            .defer(new PlaceOceanTile(player))
            .andThen(() => this.selectNextAction(player));
          return undefined;
        }),
      );
    }
    if (!this.selected.includes('city')) {
      options.push(
        new SelectOption('Place a city').andThen(() => {
          this.selected.push('city');
          player.game
            .defer(new PlaceCityTile(player))
            .andThen(() => this.selectNextAction(player));
          return undefined;
        }),
      );
    }
    if (!this.selected.includes('greenery')) {
      options.push(
        new SelectOption('Place a greenery').andThen(() => {
          this.selected.push('greenery');
          player.game
            .defer(new PlaceGreeneryTile(player))
            .andThen(() => this.selectNextAction(player));
          return undefined;
        }),
      );
    }
    if (!this.selected.includes('discard')) {
      options.push(
        new SelectOption('Discard 3 cards').andThen(() => {
          this.selected.push('discard');
          player.game
            .defer(new DiscardCards(player, 3, 3, 'Select 3 cards to discard'))
            .andThen(() => this.selectNextAction(player));
          return undefined;
        }),
      );
    }

    if (options.length > 0) {
      player.defer(new OrOptions(...options));
    }
  }

  public override play(player: IPlayer) {
    this.selected = []; // Make compatible with double down
    this.selectNextAction(player);
    return undefined;
  }
}
