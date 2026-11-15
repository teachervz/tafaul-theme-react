/**
 * Tafaul additions to the lesson (product) page, all edited from theme settings:
 * - `TafaulIncludes`: "What's inside the lesson" list under the details.
 * - `TafaulProductExtras`: bundle upsell, how-to steps and FAQ above similar products.
 * Registered as hook slots in `app/hooks/index.tsx`.
 */
import { Link } from '@salla.sa/twilight-theme-engine/common';

type Settings = Record<string, unknown> | undefined;

const str = (settings: Settings, key: string) => {
  const value = settings?.[key];
  return typeof value === 'string' ? value : '';
};
const on = (settings: Settings, key: string) => settings?.[key] !== false;
const lines = (text: string) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

export function TafaulIncludes({ settings }: { settings: Settings }) {
  const items = lines(str(settings, 'tf_includes'));
  if (!on(settings, 'tf_show_includes') || !items.length) return null;
  return (
    <div className="tf-includes">
      <h2 className="tf-h3">وش داخل الدرس؟</h2>
      {items.map((item) => (
        <div key={item} className="tf-includes__item">
          <i className="sicon-check" aria-hidden="true" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export function TafaulProductExtras({ settings }: { settings: Settings }) {
  const upsellTitle = str(settings, 'tf_upsell_title');
  const upsellButton = str(settings, 'tf_upsell_button');
  const upsellUrl = str(settings, 'tf_upsell_url') || '/#bundles';
  const showUpsell = on(settings, 'tf_show_upsell') && !!upsellTitle;

  const steps = lines(str(settings, 'tf_howto'));
  const faqs = lines(str(settings, 'tf_faq')).map((row) => {
    const [q, ...a] = row.split('|');
    return { q: q.trim(), a: a.join('|').trim() };
  });
  const showHowto = on(settings, 'tf_show_howto') && (steps.length > 0 || faqs.length > 0);

  if (!showUpsell && !showHowto) return null;

  return (
    <div className="container tf-product-extras">
      {showUpsell && (
        <div className="tf-upsell">
          <div>
            <span className="tf-upsell__kicker">وفري أكثر</span>
            <h2 className="tf-h2">{upsellTitle}</h2>
            {str(settings, 'tf_upsell_text') && <p className="tf-upsell__text">{str(settings, 'tf_upsell_text')}</p>}
          </div>
          {upsellButton && (
            <Link to={upsellUrl} className="tf-btn tf-btn--ink">
              {upsellButton}
            </Link>
          )}
        </div>
      )}

      {showHowto && (
        <div className="tf-howto">
          {steps.length > 0 && (
            <div>
              <h2 className="tf-h2">كيف أستخدمه في الحصة؟</h2>
              <div className="tf-steps">
                {steps.map((step, index) => (
                  <div key={step} className="tf-step">
                    <span className="tf-step__num">{index + 1}</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {faqs.length > 0 && (
            <div>
              <h2 className="tf-h2">أسئلة شائعة</h2>
              <div className="tf-faq">
                {faqs.map((faq) => (
                  <details key={faq.q}>
                    <summary>{faq.q}</summary>
                    {faq.a && <p>{faq.a}</p>}
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
