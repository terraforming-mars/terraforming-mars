import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CorporationCard} from '../corporation/CorporationCard';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {ICard} from '../ICard';
import {Priority} from '../../deferredActions/Priority';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Resource} from '../../../common/Resource';
import {all, digit} from '../Options';
import {SerializedCard} from '../../SerializedCard';

export class PharmacyUnion extends CorporationCard {
  constructor() {
    super({
      name: CardName.PHARMACY_UNION,
      startingMegaCredits: 46, // 54 minus 8 for the 2 diseases
      resourceType: CardResource.DISEASE,

      behavior: {
        drawCard: {count: 1, tag: Tag.SCIENCE},
        addResources: 2,
      },

      metadata: {
        cardNumber: 'R39',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(54).cards(1, {secondaryTag: Tag.SCIENCE});
          // blank space after MC is on purpose
          b.text('(You start with 54 M€ . Draw a Science card.)', Size.TINY, false, false);
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect(undefined, (eb) => {
              eb.tag(Tag.MICROBE, {all}).startEffect.resource(CardResource.DISEASE).megacredits(-4);
            });
            ce.vSpace();
            ce.effect('When ANY microbe tag is played, add a disease here and lose 4 M€ or as much as possible. When you play a science tag, remove a disease here and gain 1 TR OR if there are no diseases here, you MAY put this card face down in your EVENTS PILE to gain 3 TR.', (eb) => {
              eb.tag(Tag.SCIENCE).startEffect.minus().resource(CardResource.DISEASE);
              eb.tr(1, {size: Size.SMALL}).slash().tr(3, {size: Size.SMALL, digit});
            });
          });
        }),
      },
    });
  }

  public isDisabled = false;

  public override get tags() {
    if (this.isDisabled) {
      return [];
    }
    return [Tag.MICROBE, Tag.MICROBE];
  }

  public onCorpCardPlayed(player: IPlayer, card: ICorporationCard) {
    this.onCardPlayed(player, card);
  }

  private addDisease(player: IPlayer, count: number) {
    const megaCreditsLost = Math.min(player.megaCredits, count * 4);
    player.addResourceTo(this, count);
    player.stock.deduct(Resource.MEGACREDITS, megaCreditsLost);
    player.game.log('${0} added a disease to ${1} and lost ${2} M€', (b) => b.player(player).card(this).number(megaCreditsLost));
  }

  public onCardPlayed(player: IPlayer, card: ICard): void {
    if (this.isDisabled) {
      return;
    }

    const game = player.game;

    const hasScienceTag = player.tags.cardHasTag(card, Tag.SCIENCE);
    const hasMicrobesTag = card.tags.includes(Tag.MICROBE);
    const isPharmacyUnion = player.isCorporation(CardName.PHARMACY_UNION);

    // Edge case, let player pick order of resolution (see https://github.com/bafolts/terraforming-mars/issues/1286)
    if (isPharmacyUnion && hasScienceTag && hasMicrobesTag && this.resourceCount === 0) {
      // TODO (Lynesth): Modify this when https://github.com/bafolts/terraforming-mars/issues/1670 is fixed
      if (player.canAfford({cost: 0, tr: {tr: 3}})) {
        player.defer(() => {
          const orOptions = new OrOptions(
            new SelectOption('Turn it face down to gain 3 TR and lose up to 4 M€').andThen(() => {
              this.isDisabled = true;
              player.increaseTerraformRating(3);
              const megaCreditsLost = Math.min(player.megaCredits, 4);
              player.stock.deduct(Resource.MEGACREDITS, megaCreditsLost);
              game.log('${0} turned ${1} face down to gain 3 TR and lost ${2} M€', (b) => b.player(player).card(this).number(megaCreditsLost));
              return undefined;
            }),
            new SelectOption('Add a disease to it and lose up to 4 M€, then remove a disease to gain 1 TR').andThen(() => {
              const megaCreditsLost = Math.min(player.megaCredits, 4);
              player.increaseTerraformRating();
              player.stock.deduct(Resource.MEGACREDITS, megaCreditsLost);
              game.log('${0} added a disease to ${1} and lost ${2} M€', (b) => b.player(player).card(this).number(megaCreditsLost));
              game.log('${0} removed a disease from ${1} to gain 1 TR', (b) => b.player(player).card(this));
              return undefined;
            }),
          );
          orOptions.title = 'Choose the order of tag resolution for Pharmacy Union';
          return orOptions;
        }, Priority.PHARMACY_UNION);
        return undefined;
      }
    }

    if (isPharmacyUnion && hasScienceTag) {
      const scienceTags = player.tags.cardTagCount(card, Tag.SCIENCE);
      this.onScienceTagAdded(player, scienceTags);
    }


    if (hasMicrobesTag) {
      player.defer(() => {
        const microbeTagCount = card.tags.filter((cardTag) => cardTag === Tag.MICROBE).length;
        const player = game.getCardPlayerOrThrow(this.name);
        this.addDisease(player, microbeTagCount);
        return undefined;
      }, Priority.PHARMACY_UNION);
    }
  }

  public onColonyAddedToLeavitt(player: IPlayer) {
    this.onScienceTagAdded(player, 1);
  }
  public onScienceTagAdded(player: IPlayer, count: number) {
    const game = player.game;
    for (let i = 0; i < count; i++) {
      player.defer(() => {
        if (this.isDisabled) return undefined;

        if (this.resourceCount > 0) {
          if (player.canAfford({cost: 0, tr: {tr: 1}}) === false) {
            // TODO (Lynesth): Remove this when #1670 is fixed
            game.log('${0} cannot remove a disease from ${1} to gain 1 TR because of unaffordable Reds policy cost', (b) => b.player(player).card(this));
          } else {
            player.removeResourceFrom(this, 1);
            player.increaseTerraformRating();
            game.log('${0} removed a disease from ${1} to gain 1 TR', (b) => b.player(player).card(this));
          }
          return undefined;
        }

        if (player.canAfford({cost: 0, tr: {tr: 3}}) === false) {
          // TODO (Lynesth): Remove this when #1670 is fixed
          game.log('${0} cannot turn ${1} face down to gain 3 TR because of unaffordable Reds policy cost', (b) => b.player(player).card(this));
          return undefined;
        }

        return new OrOptions(
          new SelectOption('Turn this card face down and gain 3 TR', 'Gain TR').andThen(() => {
            this.isDisabled = true;
            player.increaseTerraformRating(3);
            game.log('${0} turned ${1} face down to gain 3 TR', (b) => b.player(player).card(this));
            return undefined;
          }),
          new SelectOption('Do nothing', 'Do nothing'),
        );
      }, Priority.SUPERPOWER); // Make it a priority
    }
  }

  public serialize(serialized: SerializedCard) {
    serialized.isDisabled = this.isDisabled;
  }

  public deserialize(serialized: SerializedCard) {
    this.isDisabled = Boolean(serialized.isDisabled);
  }
}
