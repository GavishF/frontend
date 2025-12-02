import * as XLSX from 'xlsx';

export function generateProductTemplate() {
  const headers = [
    'productId', 'name', 'description', 'category', 'price', 'labelledPrice',
    'stock', 'isAvailable', 'images', 'altNames'
  ];
  const sample = [
    {
      productId: 'NKL001',
      name: 'Sample Product',
      description: 'Describe the product',
      category: 'women',
      price: 99.99,
      labelledPrice: 129.99,
      stock: 10,
      isAvailable: true,
      images: 'https://example.com/image1.jpg;https://example.com/image2.jpg',
      altNames: 'Alt Name 1;Alt Name 2'
    }
  ];
  const ws = XLSX.utils.json_to_sheet(sample, { header: headers });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Products');
  return wb;
}

export function downloadProductTemplate(filename = 'nikola_products_template.xlsx') {
  const wb = generateProductTemplate();
  XLSX.writeFile(wb, filename);
}

export async function parseProductsXLS(file) {
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data, { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
  return rows.map((r, idx) => ({
    productId: String(r.productId || '').trim() || `NKL${String(idx + 1).padStart(3,'0')}`,
    name: String(r.name || '').trim(),
    description: String(r.description || '').trim(),
    category: String(r.category || '').trim(),
    price: Number(r.price || 0),
    labelledPrice: Number(r.labelledPrice || r.price || 0),
    stock: Number(r.stock || 0),
    isAvailable: String(r.isAvailable || 'true').toLowerCase() === 'true',
    images: String(r.images || '').split(';').map(s => s.trim()).filter(Boolean),
    altNames: String(r.altNames || '').split(';').map(s => s.trim()).filter(Boolean),
  }));
}
