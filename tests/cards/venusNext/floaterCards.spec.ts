import {expect} from 'chai';
import {ALL_MODULE_MANIFESTS} from '../../../src/server/cards/AllManifests';
import {floaterCards} from '../../../src/server/cards/venusNext/floaterCards';
import {CardName} from '../../../src/common/cards/CardName';
import {CardResource} from '../../../src/common/CardResource';
import {CardManifest} from '../../../src/server/cards/ModuleManifest';
import {CardType} from '../../../src/common/cards/CardType';

describe('floaterCards', function() {
  it('Ensure static list contains all cards that mention floaters', function() {
    const found: Array<CardName> = [];
    ALL_MODULE_MANIFESTS.forEach((manifest) => {
      CardManifest.entries(manifest.projectCards).forEach((entry) => {
        const factory = entry[1];
        const card = new factory!.Factory();

        // Only looking for cards that mention floaters in the metadata
        // or requirements. Cards with floater resources don't need to be hand-verified.
        if (card.resourceType === CardResource.FLOATER) return;
        if (card.type === CardType.PROXY) return;

        const renderData = card.metadata.renderData;
        if (renderData === undefined) return;

        const string = JSON.stringify(renderData);
        if (string.toLowerCase().includes('floater')) {
          found.push(card.name);
        } else if (card.requirements?.some((req) => req.floaters !== undefined)) {
          found.push(card.name);
        }
      });
    });
    expect(Array.from(floaterCards.values())).to.have.members(found);
  });
});
