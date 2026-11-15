/**
 * Loads Tafaul's fonts (IBM Plex Sans Arabic for text, Readex Pro for headings)
 * unless the merchant turns off `tafaul_fonts`. React 19 hoists both tags into <head>.
 * Registered at `body:start` in `app/hooks/index.tsx`.
 */
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Readex+Pro:wght@500;600;700&display=swap';

const FONTS_CSS = `body{--font-main:'IBM Plex Sans Arabic',sans-serif;--tf-display:'Readex Pro','IBM Plex Sans Arabic',sans-serif}`;

export function TafaulBrand({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={FONTS_URL} precedence="default" />
      <style href="tafaul-fonts" precedence="default">
        {FONTS_CSS}
      </style>
    </>
  );
}
