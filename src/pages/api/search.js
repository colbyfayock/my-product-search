
import { getXataClient } from 'src/lib/xata';

const xata = getXataClient();

export default async function handler(req, res) {
  const { query, category } = JSON.parse(req.body);

  const table = {
    table: 'products',
    target: [{ column: "productName", weight: 6 }, { column: "category" }],
  };

  if ( category ) {
    table.filter = {
      category
    }
  }

  const records = await xata.search.all(query, {
    tables: [table],
    fuzziness: 1,
    prefix: 'phrase',
  });

  res.status(200).json({
    products: records.map(({ record }) => record)
  });
}