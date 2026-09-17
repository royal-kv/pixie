import type { Session } from '../types';
import type { EffectiveBrief } from './agents';

/** Merges the stored brand brief with uploaded assets and redemption codes into the shape
 * downstream agents expect. Uploaded data URLs are used as logo_url/product_image_url when the
 * intake agent didn't source a first-party image URL from the site. */
export function composeEffectiveBrief(session: Session): EffectiveBrief {
  return {
    ...session.brandBrief,
    logo_url: session.brandBrief.logo_url || session.assets.logoDataUrl,
    product_image_url: session.brandBrief.product_image_url || session.assets.productImageDataUrl,
    redemption_codes: session.redemptionCodes,
  };
}
