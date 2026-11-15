/**
 * تفاعل (Tafaul) home blocks. Each one is declared in twilight.json under
 * `home.tafaul-*` and registered by key in `app/router.tsx`.
 * Styles: `app/styles/04-components/tafaul.scss`.
 */
import { useCallback, useState, type ReactNode } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { product, type ProductsListSource } from '@salla.sa/twilight-theme-engine/api/product';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { ProductCardSkeleton, SallaProductsList } from '@salla.sa/twilight-components-react';
import { ProductCard } from '../product';
import { useProductCardLayout } from '../../hooks/useProductCardLayout';

type Data<T> = { data: T & { position?: number; [key: string]: unknown } };

const href = (url?: string) => (url && url !== '' ? url : '#');

/** Internal and absolute store links go through the engine `Link`; bare anchors stay plain. */
function TfLink({ url, className, children }: { url?: string; className?: string; children: ReactNode }) {
  const to = href(url);
  if (to.startsWith('#')) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

/* ---------------- Hero with a try-it quiz ---------------- */

export interface TafaulHeroData {
  badge?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  btn1_text?: string;
  btn1_url?: string;
  btn2_text?: string;
  btn2_url?: string;
  show_quiz?: boolean;
  quiz_hint?: string;
  quiz_label?: string;
  quiz_question?: string;
  quiz_options?: { text?: string }[];
  correct_option?: number;
  quiz_right?: string;
  quiz_wrong?: string;
}

function HeroTitle({ title, highlight }: { title: string; highlight?: string }) {
  if (!highlight || !title.includes(highlight)) return <>{title}</>;
  const [before, ...rest] = title.split(highlight);
  return (
    <>
      {before}
      <span>{highlight}</span>
      {rest.join(highlight)}
    </>
  );
}

function Quiz({ data }: { data: TafaulHeroData }) {
  const [picked, setPicked] = useState<number | null>(null);
  const options = (data.quiz_options ?? []).filter((o) => o?.text);
  const correct = Math.max(1, Number(data.correct_option) || 1) - 1;
  const isRight = picked === correct;

  return (
    <div className="tf-window">
      <div className="tf-window__dots" aria-hidden="true">
        <span style={{ background: '#FF6B5B' }} />
        <span style={{ background: '#FFB547' }} />
        <span style={{ background: '#3DD68C' }} />
      </div>
      <div className="tf-window__body">
        <div className="tf-quiz__top">
          <span>{data.quiz_hint}</span>
          {data.quiz_label && <span className="tf-badge tf-badge--violet">{data.quiz_label}</span>}
        </div>
        <h3 className="tf-quiz__q">{data.quiz_question}</h3>
        <div className="tf-quiz__options">
          {options.map((option, index) => {
            let state = '';
            if (picked !== null && index === correct) state = ' is-right';
            else if (picked === index) state = ' is-wrong';
            return (
              <button
                // Merchant-authored static list with no ids.
                // react-doctor-disable-next-line react-doctor/no-array-index-as-key
                key={index}
                type="button"
                className={`tf-quiz__opt${state}`}
                onClick={() => setPicked(index)}
              >
                {option.text}
              </button>
            );
          })}
        </div>
        <p
          className={`tf-quiz__feedback${picked === null ? '' : isRight ? ' is-right' : ' is-wrong'}`}
          aria-live="polite"
        >
          {picked === null ? '' : isRight ? data.quiz_right || 'أحسنتِ!' : data.quiz_wrong || 'حاولي مرة ثانية'}
        </p>
      </div>
    </div>
  );
}

export function TafaulHero({ data }: Data<TafaulHeroData>) {
  const showQuiz = data.show_quiz !== false && !!data.quiz_question && !!data.quiz_options?.length;
  return (
    <div className="tf-hero">
      <div className="container">
        <div className="tf-hero__grid">
          <div className="tf-hero__text">
            {data.badge && <span className="tf-badge">{data.badge}</span>}
            {data.title && (
              <h2 className="tf-hero__title">
                <HeroTitle title={data.title} highlight={data.highlight} />
              </h2>
            )}
            {data.subtitle && <p className="tf-lead">{data.subtitle}</p>}
            <div className="tf-hero__actions">
              {data.btn1_text && (
                <TfLink url={data.btn1_url} className="tf-btn tf-btn--primary">
                  {data.btn1_text}
                </TfLink>
              )}
              {data.btn2_text && (
                <TfLink url={data.btn2_url} className="tf-btn tf-btn--outline">
                  {data.btn2_text}
                </TfLink>
              )}
            </div>
          </div>
          {showQuiz && (
            <div className="tf-hero__demo">
              <Quiz data={data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Features ---------------- */

export function TafaulFeatures({
  data,
}: Data<{ title?: string; items?: { icon?: string; title?: string; text?: string }[] }>) {
  const items = (data.items ?? []).filter((i) => i?.title);
  if (!items.length) return null;
  return (
    <div className="tf-section tf-features">
      <div className="container">
        {data.title && <h2 className="tf-h2 tf-mb">{data.title}</h2>}
        <div className="tf-features__grid">
          {items.map((item) => (
            <div key={item.title} className="tf-feature">
              <span className="tf-feature__icon">
                <i className={item.icon || 'sicon-check'} aria-hidden="true" />
              </span>
              <h3 className="tf-h3">{item.title}</h3>
              {item.text && <p className="tf-muted">{item.text}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Browse by stage ---------------- */

export function TafaulStages({
  data,
}: Data<{ title?: string; items?: { title?: string; subtitle?: string; url?: string }[] }>) {
  const items = (data.items ?? []).filter((i) => i?.title);
  if (!items.length) return null;
  return (
    <div className="tf-section tf-section--tight">
      <div className="container">
        {data.title && <h2 className="tf-h2 tf-mb">{data.title}</h2>}
        <div className="tf-stages__grid">
          {items.map((item, index) => (
            <TfLink key={item.title} url={item.url} className={`tf-stage tf-stage--${(index % 4) + 1}`}>
              <span>
                <span className="tf-stage__title">{item.title}</span>
                {item.subtitle && <span className="tf-muted">{item.subtitle}</span>}
              </span>
              <i className="sicon-keyboard_arrow_left rtl:inline-block ltr:rotate-180" aria-hidden="true" />
            </TfLink>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Lessons (product grid) ---------------- */

interface SourceConfig {
  source?: string;
  source_value?: number | number[] | null;
}

export function TafaulLessons({
  data,
}: Data<{
  title?: string;
  products?: SourceConfig | Product[];
  limit?: number;
  display_all_text?: string;
  display_all_url?: string;
}>) {
  const layout = useProductCardLayout();
  const field = data.products;
  let source: ProductsListSource = 'latest';
  let sourceValue: number | number[] | undefined;
  if (Array.isArray(field)) {
    const ids = field.map((p) => p.id).filter((id): id is number => typeof id === 'number');
    if (ids.length) {
      source = 'selected';
      sourceValue = ids;
    }
  } else if (field && typeof field === 'object' && field.source) {
    source = field.source as ProductsListSource;
    sourceValue = field.source_value ?? undefined;
  }
  const limit = Math.min(24, Math.max(2, Number(data.limit) || 8));
  const valueKey = Array.isArray(sourceValue) ? sourceValue.join(',') : String(sourceValue ?? '');

  const loader = useCallback(async () => {
    // Rebuilt from valueKey so the callback only changes when the ids do.
    const ids = valueKey ? valueKey.split(',').map(Number) : undefined;
    const result = await product.list({ source, sourceValue: ids, perPage: limit });
    return { items: result.items.slice(0, limit), next: null };
  }, [source, valueKey, limit]);

  const displayAll = data.display_all_url && data.display_all_url !== '#' ? data.display_all_url : undefined;

  return (
    <div className="tf-section tf-lessons" id="lessons">
      <div className="container">
        <div className="tf-section-head">
          <h2 className="tf-h2">{data.title || 'أحدث الدروس'}</h2>
          {displayAll && (
            <TfLink url={displayAll} className="tf-link">
              {data.display_all_text || 'كل الدروس'}
            </TfLink>
          )}
        </div>
        <SallaProductsList<Product>
          loader={loader}
          resetKey={`${source}:${valueKey}:${limit}`}
          itemsClassName={`s-products-list-${layout}-cards`}
          skeleton={<ProductCardSkeleton />}
          skeletonType="item"
          skeletonCount={4}
        >
          {(products) => products.map((item) => <ProductCard key={item.id} product={item} layout={layout} />)}
        </SallaProductsList>
      </div>
    </div>
  );
}

/* ---------------- Bundles ---------------- */

interface BundleItem {
  label?: string;
  title?: string;
  old_price?: string;
  price?: string;
  button?: string;
  url?: string;
}

export function TafaulBundles({
  data,
}: Data<{ title?: string; subtitle?: string; featured?: number; items?: BundleItem[] }>) {
  const items = (data.items ?? []).filter((i) => i?.title);
  if (!items.length) return null;
  const featured = Number(data.featured) || 0;
  return (
    <div className="tf-section tf-bundles" id="bundles">
      <div className="container">
        {data.title && <h2 className="tf-h2">{data.title}</h2>}
        {data.subtitle && <p className="tf-lead tf-mt">{data.subtitle}</p>}
        <div className="tf-bundles__grid">
          {items.map((item, index) => {
            const isFeatured = index + 1 === featured;
            return (
              <div key={item.title} className={`tf-bundle${isFeatured ? ' tf-bundle--featured' : ''}`}>
                {item.label && <span className="tf-bundle__label">{item.label}</span>}
                <h3 className="tf-h2 tf-bundle__title">{item.title}</h3>
                {item.old_price && (
                  <p className="tf-bundle__was">
                    بدل <span className="tf-bundle__old">{item.old_price} ر.س</span>
                  </p>
                )}
                {item.price && (
                  <span className="tf-bundle__price">
                    {item.price} <small>ر.س</small>
                  </span>
                )}
                {item.button && (
                  <TfLink url={item.url} className={`tf-btn ${isFeatured ? 'tf-btn--ink' : 'tf-btn--light'}`}>
                    {item.button}
                  </TfLink>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Videos ---------------- */

export function TafaulVideos({
  data,
}: Data<{
  title?: string;
  text?: string;
  button_text?: string;
  button_url?: string;
  items?: { image?: string; url?: string }[];
}>) {
  const items = (data.items ?? []).filter((i) => i?.image).slice(0, 3);
  return (
    <div className="tf-section">
      <div className="container">
        <div className="tf-videos__grid">
          <div className="tf-videos__text">
            {data.title && <h2 className="tf-h2 tf-mb-sm">{data.title}</h2>}
            {data.text && <p className="tf-lead tf-mb">{data.text}</p>}
            {data.button_text && (
              <TfLink url={data.button_url} className="tf-btn tf-btn--primary">
                <i className="sicon-play" aria-hidden="true" /> {data.button_text}
              </TfLink>
            )}
          </div>
          {items.length > 0 && (
            <div className="tf-videos__list">
              {items.map((item, index) => (
                <a
                  key={item.image}
                  href={href(item.url || data.button_url)}
                  className="tf-video"
                  target="_blank"
                  rel="noopener"
                  aria-label={`مشاهدة المقطع ${index + 1}`}
                >
                  <img src={item.image} alt="" loading="lazy" decoding="async" />
                  <span className="tf-video__play" aria-hidden="true">
                    <i className="sicon-play" />
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Custom order CTA ---------------- */

export function TafaulCta({
  data,
}: Data<{ title?: string; text?: string; button_text?: string; button_url?: string }>) {
  if (!data.title) return null;
  return (
    <div className="tf-section" id="custom">
      <div className="container">
        <div className="tf-cta">
          <div>
            <h2 className="tf-h2 tf-mb-sm">{data.title}</h2>
            {data.text && <p className="tf-lead">{data.text}</p>}
          </div>
          {data.button_text && (
            <TfLink url={data.button_url} className="tf-btn tf-btn--ink">
              {data.button_text}
            </TfLink>
          )}
        </div>
      </div>
    </div>
  );
}
