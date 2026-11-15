import { hookRegistry, HookName, type HookContext } from '@salla.sa/twilight-theme-engine/hooks';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { AddProductToast } from '../components/cart';
import { DigitalFilesSettings } from '../components/product';
import { TafaulBrand } from '../components/tafaul/TafaulBrand';
import { TafaulIncludes, TafaulProductExtras } from '../components/tafaul/ProductExtras';

/** Theme settings as a plain map, for the Tafaul keys `ThemeSettings` doesn't type. */
const tafaulSettings = (context: HookContext) =>
  context.twilight?.theme?.settings as unknown as Record<string, unknown> | undefined;

export function registerThemeHooks() {
  // Register AddProductToast at body:end hook slot. Default on (twilight.json
  // ships the setting `"value": true`); only an explicit `false` turns it off.
  hookRegistry.register(
    HookName.BODY_END,
    (context: HookContext) => {
      const { twilight } = context;
      if (twilight?.theme?.settings?.enable_add_product_toast === false) return null;
      return <AddProductToast />;
    },
    50
  );

  // Register DigitalFilesSettings at product:single.description hook slot
  // Receives product from ProductDetails via context prop
  hookRegistry.register(
    HookName.PRODUCT_DESCRIPTION,
    (context: HookContext) => {
      const { product } = context as { product?: Product };
      if (!product?.digital_files_settings) return null;
      return <DigitalFilesSettings {...product.digital_files_settings} />;
    },
    50
  );
  // Tafaul: brand fonts in <head> (hoisted by React 19).
  hookRegistry.register(
    HookName.BODY_START,
    (context: HookContext) => (
      <TafaulBrand enabled={tafaulSettings(context)?.tafaul_fonts !== false} />
    ),
    10
  );

  // Tafaul: "what's inside the lesson" under the product details.
  hookRegistry.register(
    HookName.PRODUCT_DETAILS_END,
    (context: HookContext) => <TafaulIncludes settings={tafaulSettings(context)} />,
    50
  );

  // Tafaul: bundle upsell, how-to and FAQ above the similar products.
  hookRegistry.register(
    HookName.PRODUCT_RELATED_START,
    (context: HookContext) => <TafaulProductExtras settings={tafaulSettings(context)} />,
    50
  );
}
