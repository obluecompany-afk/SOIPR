// Render Liquid templates → static HTML cho preview localhost
// Mock đầy đủ data Haravan-style (shop, product, collection, cart, settings)
// Output: dist/preview/{index,product,collection,cart,login,register,account,blog,article,about,contact,404}.html

import { Liquid } from 'liquidjs';
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'haravan-theme');
const DIST = join(ROOT, 'dist', 'preview');

// ===== Mock data =====
const formatVND = (n) =>
  Math.round(Number(n) || 0).toLocaleString('vi-VN') + '₫';

const handleize = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function makeProduct(id, title, price, opts = {}) {
  const variants = opts.variants || [{ id: id * 100, title: 'Default Title', price, available: true }];
  return {
    id, title,
    handle: handleize(title),
    url: '/products/' + handleize(title),
    description: opts.description || `Mô tả ${title}: sản phẩm chất lượng cao S.O.I.`,
    summary: opts.summary || '',
    price,
    compare_at_price: opts.compare_at_price || 0,
    featured_image: opts.image || null,
    images: opts.images || (opts.image ? [opts.image] : []),
    variants,
    options: opts.options || [],
    tags: opts.tags || [],
    type: opts.type || '',
    selected_or_first_available_variant: variants[0],
    available: true,
  };
}

const PRODUCTS = [
  makeProduct(1, 'Mask Fit Red Cushion', 625000, {
    summary: 'Rạng rỡ bền lâu',
    image: '/preview-assets/p1.png',
    tags: ['new', 'best'],
    variants: Array.from({ length: 40 }, (_, i) => ({ id: 100 + i, title: `Shade ${i + 1}`, price: 625000, available: true })),
    options: ['Color'],
  }),
  makeProduct(2, 'Mask Fit Red Foundation', 675000, {
    summary: 'Kem nền lỏng, nhẹ tênh',
    tags: ['new'],
    variants: Array.from({ length: 30 }, (_, i) => ({ id: 200 + i, title: `Tone ${i + 1}`, price: 675000, available: true })),
    options: ['Color'],
  }),
  makeProduct(3, 'Mask Fit AI Filter Cushion', 625000, {
    summary: 'Che phủ hoàn hảo',
    description: 'Làn da hoàn hảo như qua bộ lọc — giờ là sự thật. Làm mờ khuyết điểm, mịn da, cho lớp nền không lỗ chân lông with the TIRTIR Mask Fit AI Filter Cushion. Powered by Thin-Tech™ technology and enriched with pore-refining skincare ingredients, this matte cushion foundation delivers high coverage with a featherlight feel that lasts up to 72 hours.',
    tags: ['hot', 'best'],
    variants: Array.from({ length: 30 }, (_, i) => ({ id: 300 + i, title: `${10 + i}C Shell`, price: 625000, available: true })),
    options: ['Color'],
    images: ['/preview-assets/p3-1.png', '/preview-assets/p3-2.png', '/preview-assets/p3-3.png', '/preview-assets/p3-4.png'],
  }),
  makeProduct(4, 'Glide & Hide Blurring Concealer', 400000, {
    summary: 'Kem che khuyết điểm 2-in-1',
    tags: ['new'],
  }),
];
PRODUCTS[2].images = PRODUCTS[2].images || [];

const COLLECTION_BEST = {
  title: 'Best Sellers',
  handle: 'bestsellers',
  url: '/collections/bestsellers',
  description: '',
  image: null,
  products: PRODUCTS,
  products_count: PRODUCTS.length,
};

const COLLECTIONS = {
  bestsellers: COLLECTION_BEST,
  all: COLLECTION_BEST,
  new: COLLECTION_BEST,
  trending: COLLECTION_BEST,
  cushion: COLLECTION_BEST,
  family: COLLECTION_BEST,
  sets: COLLECTION_BEST,
  size: 1,
};
// Iterable
COLLECTIONS[Symbol.iterator] = function* () {
  yield COLLECTION_BEST;
};

const SHOP = {
  name: 'S.O.I',
  url: 'http://localhost:8081',
  email: 'hello@soi.vn',
  description: 'K-Beauty store',
  address: '123 Đường Demo, Quận 1, TP.HCM',
  phone: '+84 90 000 0000',
  permanent_domain: 'soi.myharavan.com',
};

const SETTINGS = {
  logo_text: 'S.O.I',
  logo_image: '',
  color_primary: '#C8102E',
  hero_image: 'https://nwqioxuljlnkpphrsnym.supabase.co/storage/v1/object/public/SOI/651195877_122115062367200234_8744813894611348777_n.jpg',
  hero_title: 'MATCHAREFRESH',
  hero_tag: 'ƯU ĐÃI MÙA XUÂN',
  hero_link: '/collections/all',
  hero_date: '20/04 — 27/04',
  free_shipping_threshold: '1250000',
};

const CART = {
  item_count: 2,
  items: [
    { product: PRODUCTS[0], variant: PRODUCTS[0].variants[0], price: 625000, line_price: 625000, quantity: 1, title: PRODUCTS[0].title, image: null, url: PRODUCTS[0].url },
    { product: PRODUCTS[3], variant: PRODUCTS[3].variants[0], price: 400000, line_price: 400000, quantity: 1, title: PRODUCTS[3].title, image: null, url: PRODUCTS[3].url },
  ],
  total_price: 1025000,
  subtotal_price: 1025000,
};

const LINKLISTS = {
  'main-menu': {
    links: [
      { title: 'Mua sắm', url: '/collections/all' },
      { title: 'Trang điểm', url: '/collections/makeup' },
      { title: 'Chăm sóc da', url: '/collections/skincare' },
      { title: 'Ưu đãi', url: '/collections/deals' },
      { title: 'Thẻ quà tặng', url: '/pages/gift-card' },
      { title: 'Dịch vụ ảo', url: '/pages/virtual-services' },
      { title: 'Liên hệ', url: '/pages/contact' },
      { title: 'Tiracels', url: '/pages/tiracels' },
      { title: 'Tin tức', url: '/blogs/news' },
      { title: 'Phần thưởng', url: '/pages/rewards' },
    ],
  },
  footer: {
    links: [
      { title: 'Hợp tác', url: '/pages/about' },
      { title: 'Tiếp cận', url: '/pages/contact' },
      { title: 'Điều khoản dịch vụ', url: '/policies/terms-of-service' },
      { title: 'Chính sách bảo mật', url: '/policies/privacy-policy' },
      { title: 'Chính sách vận chuyển', url: '/policies/shipping-policy' },
      { title: 'Chính sách hoàn tiền', url: '/policies/refund-policy' },
    ],
  },
};

// ===== Liquid engine với custom filters =====
const engine = new Liquid({
  root: [join(SRC, 'snippets'), join(SRC, 'templates'), join(SRC, 'layout')],
  extname: '.liquid',
  jsTruthy: true,
});

engine.registerFilter('money', (n) => formatVND(n));
engine.registerFilter('money_with_currency', (n) => formatVND(n) + ' VND');
engine.registerFilter('product_img_url', (img, size) => img || `/preview-assets/placeholder.svg`);
engine.registerFilter('article_img_url', (img, size) => img || `/preview-assets/placeholder.svg`);
engine.registerFilter('collection_img_url', (img, size) => img || `/preview-assets/placeholder.svg`);
engine.registerFilter('asset_url', (file) => `/assets/${file}`);
engine.registerFilter('stylesheet_tag', (url) => `<link rel="stylesheet" href="${url}" />`);
engine.registerFilter('script_tag', (url) => `<script src="${url}"></script>`);
engine.registerFilter('img_tag', (url, alt) => `<img src="${url}" alt="${alt || ''}" />`);
engine.registerFilter('handle', (s) => handleize(s));
engine.registerFilter('handleize', (s) => handleize(s));
engine.registerFilter('default_errors', (errs) => {
  if (!errs || !errs.length) return '';
  return '<ul>' + errs.map(e => `<li>${e}</li>`).join('') + '</ul>';
});

// {% form 'type' %} ... {% endform %}
engine.registerTag('form', {
  parse(tag, remainTokens) {
    this.formType = tag.args.replace(/['"]/g, '').split(',')[0].trim();
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remainTokens);
    stream
      .on('tag:endform', () => stream.stop())
      .on('template', (tpl) => this.tpls.push(tpl))
      .on('end', () => { throw new Error('Tag form not closed'); });
    stream.start();
  },
  async render(ctx, emitter) {
    ctx.push({ form: { errors: null, posted_successfully: false } });
    const html = await this.liquid.renderer.renderTemplates(this.tpls, ctx);
    const action = this.formType === 'customer_login' ? '/account/login'
      : this.formType === 'create_customer' ? '/account/register'
      : this.formType === 'contact' ? '/contact'
      : this.formType === 'customer' ? '/account'
      : '/account';
    emitter.write(`<form action="${action}" method="post">${html}</form>`);
    ctx.pop();
  },
});

// {% paginate by N %} ... {% endpaginate %}
engine.registerTag('paginate', {
  parse(tag, remainTokens) {
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remainTokens);
    stream
      .on('tag:endpaginate', () => stream.stop())
      .on('template', (tpl) => this.tpls.push(tpl))
      .on('end', () => { throw new Error('Tag paginate not closed'); });
    stream.start();
  },
  async render(ctx, emitter) {
    ctx.push({ paginate: { pages: 1, parts: [], previous: null, next: null } });
    const html = await this.liquid.renderer.renderTemplates(this.tpls, ctx);
    emitter.write(html);
    ctx.pop();
  },
});

// content_for_header / content_for_layout — replaced by include processing
const layoutTpl = readFileSync(join(SRC, 'layout', 'theme.liquid'), 'utf8');

async function renderPage(templateName, contextOverrides = {}, pageTitle = '') {
  const tplPath = join(SRC, 'templates', templateName + '.liquid');
  if (!existsSync(tplPath)) {
    console.warn(`  ⚠️ ${templateName}.liquid not found, skip`);
    return null;
  }
  const tpl = readFileSync(tplPath, 'utf8');
  const baseCtx = {
    shop: SHOP,
    settings: SETTINGS,
    cart: CART,
    collections: COLLECTIONS,
    linklists: LINKLISTS,
    template: templateName,
    page_title: pageTitle || templateName,
    page_description: '',
    content_for_header: '<!-- haravan injected scripts go here -->',
    customer: null,
    ...contextOverrides,
  };

  const innerHtml = await engine.parseAndRender(tpl, baseCtx);
  const fullHtml = await engine.parseAndRender(layoutTpl, {
    ...baseCtx,
    content_for_layout: innerHtml,
  });
  return fullHtml;
}

// ===== Render all pages =====
async function main() {
  // Clean & prepare dist
  if (existsSync(DIST)) rmSync(DIST, { recursive: true });
  mkdirSync(DIST, { recursive: true });
  mkdirSync(join(DIST, 'assets'), { recursive: true });

  // Copy assets
  cpSync(join(SRC, 'assets'), join(DIST, 'assets'), { recursive: true });

  console.log('📄 Rendering pages...');

  const pages = [
    { name: 'index', context: {}, file: 'index.html' },
    { name: 'product', context: { product: PRODUCTS[2], collection: COLLECTION_BEST }, file: 'product.html' },
    { name: 'collection', context: { collection: COLLECTION_BEST, current_sort_by: 'manual', current_tags: [] }, file: 'collection.html' },
    { name: 'cart', context: {}, file: 'cart.html' },
    { name: '404', context: {}, file: '404.html' },
    { name: 'list_collections', context: {}, file: 'list-collections.html' },
    { name: 'search', context: { search: { performed: false, terms: '', results: [], results_count: 0 } }, file: 'search.html' },
    { name: 'blog', context: { blog: { title: 'Tin tức', articles: [], comments_enabled: false } }, file: 'blog.html' },
    { name: 'page', context: { page: { title: 'Về chúng tôi', content: '<p>Câu chuyện S.O.I — K-Beauty Vietnam</p>' } }, file: 'about.html' },
    { name: 'page.contact', context: { page: { title: 'Liên hệ', content: '' } }, file: 'contact.html' },
    { name: 'customers/login', context: {}, file: 'login.html' },
    { name: 'customers/register', context: {}, file: 'register.html' },
  ];

  for (const p of pages) {
    try {
      const html = await renderPage(p.name, p.context, p.file.replace('.html', ''));
      if (html) {
        writeFileSync(join(DIST, p.file), html);
        console.log(`  ✓ ${p.file}`);
      }
    } catch (err) {
      console.error(`  ✗ ${p.file}:`, err.message);
    }
  }

  // Index nav navigator (all-pages.html)
  const allPagesHtml = `<!DOCTYPE html><html><head><title>S.O.I — Preview Index</title>
<style>body{font-family:Helvetica,Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto;}
a{display:block;padding:10px 14px;border:1px solid #eee;margin:6px 0;color:#111;text-decoration:none;border-radius:6px;}
a:hover{background:#f5f5f5;}h1{margin-bottom:20px;}.tag{font-size:11px;color:#888;float:right;}</style></head>
<body>
<h1>S.O.I — Haravan Theme Preview</h1>
<p style="color:#888;font-size:13px;">Render từ haravan-theme/templates/*.liquid với mock data Haravan</p>
${pages.map(p => `<a href="${p.file}">${p.file} <span class="tag">${p.name}.liquid</span></a>`).join('')}
</body></html>`;
  writeFileSync(join(DIST, 'all-pages.html'), allPagesHtml);
  console.log('  ✓ all-pages.html (index)');

  console.log(`\n✅ Done. Output: ${DIST}`);
}

main().catch(err => { console.error(err); process.exit(1); });
