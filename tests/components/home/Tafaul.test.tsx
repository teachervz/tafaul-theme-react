import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

vi.mock('../../../app/components/product', () => ({ ProductCard: () => null }));
vi.mock('@salla.sa/twilight-theme-engine/api/product', () => ({ product: { list: vi.fn() } }));

vi.mock('@salla.sa/twilight-theme-engine/common', () => ({
  Link: ({ to, children, className }: { to: string; children?: React.ReactNode; className?: string }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

import { TafaulHero, TafaulBundles, TafaulStages, TafaulCta } from '../../../app/components/home/Tafaul';
import { TafaulIncludes, TafaulProductExtras } from '../../../app/components/tafaul/ProductExtras';

describe('Tafaul blocks', () => {
  const hero = {
    title: 'حصتك تصير تفاعل، مو شرائح',
    highlight: 'تفاعل',
    btn1_text: 'تصفحي الدروس',
    btn1_url: '/lessons',
    quiz_question: 'أي وحدة لغة برمجة؟',
    quiz_options: [{ text: 'بايثون' }, { text: 'إكسل' }],
    correct_option: 1,
    quiz_right: 'أحسنتِ',
    quiz_wrong: 'قريبة',
  };

  it('highlights the chosen word in the title', () => {
    const { container } = render(<TafaulHero data={hero} />);
    expect(container.querySelector('.tf-hero__title span')?.textContent).toBe('تفاعل');
    expect(container.querySelector('a.tf-btn--primary')?.getAttribute('href')).toBe('/lessons');
  });

  it('marks a wrong answer and reveals the right one', () => {
    const { container, getByText } = render(<TafaulHero data={hero} />);
    fireEvent.click(getByText('إكسل'));
    expect(getByText('إكسل').className).toContain('is-wrong');
    expect(getByText('بايثون').className).toContain('is-right');
    expect(container.querySelector('.tf-quiz__feedback')?.textContent).toBe('قريبة');
  });

  it('confirms a right answer', () => {
    const { container, getByText } = render(<TafaulHero data={hero} />);
    fireEvent.click(getByText('بايثون'));
    expect(container.querySelector('.tf-quiz__feedback')?.textContent).toBe('أحسنتِ');
  });

  it('hides the quiz when switched off', () => {
    const { container } = render(<TafaulHero data={{ ...hero, show_quiz: false }} />);
    expect(container.querySelector('.tf-quiz__q')).toBeNull();
  });

  it('highlights the featured bundle', () => {
    const { container } = render(
      <TafaulBundles
        data={{ featured: 2, items: [{ title: 'وحدة', price: '149' }, { title: 'فصل', price: '249', button: 'اختاري' }] }}
      />
    );
    const cards = container.querySelectorAll('.tf-bundle');
    expect(cards).toHaveLength(2);
    expect(cards[1].className).toContain('tf-bundle--featured');
  });

  it('cycles stage colors and skips empty items', () => {
    const { container } = render(
      <TafaulStages data={{ items: [{ title: 'ابتدائي' }, { title: '' }, { title: 'متوسط' }] }} />
    );
    const stages = container.querySelectorAll('.tf-stage');
    expect(stages).toHaveLength(2);
    expect(stages[1].className).toContain('tf-stage--2');
  });

  it('renders nothing for an empty CTA', () => {
    const { container } = render(<TafaulCta data={{}} />);
    expect(container.innerHTML).toBe('');
  });
});

describe('Tafaul lesson page extras', () => {
  it('lists one include per line', () => {
    const { container } = render(<TafaulIncludes settings={{ tf_includes: 'شرائح\n\nأنشطة\n' }} />);
    expect(container.querySelectorAll('.tf-includes__item')).toHaveLength(2);
  });

  it('splits FAQ rows on |', () => {
    const { container } = render(
      <TafaulProductExtras settings={{ tf_faq: 'أحتاج إنترنت؟ | لا\nسؤال بدون جواب', tf_upsell_title: '' }} />
    );
    const items = container.querySelectorAll('.tf-faq details');
    expect(items).toHaveLength(2);
    expect(items[0].querySelector('summary')?.textContent).toBe('أحتاج إنترنت؟');
    expect(items[0].querySelector('p')?.textContent).toBe('لا');
    expect(items[1].querySelector('p')).toBeNull();
  });

  it('respects the switches', () => {
    const { container } = render(
      <TafaulProductExtras
        settings={{ tf_show_upsell: false, tf_show_howto: false, tf_upsell_title: 'x', tf_howto: 'a' }}
      />
    );
    expect(container.innerHTML).toBe('');
  });
});
