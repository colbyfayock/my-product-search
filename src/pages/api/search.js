import { getXataClient } from 'src/lib/xata';

const xata = getXataClient();

export default async function handler(req, res) {
  const { query } = JSON.parse(req.body);

  const records = await xata.search.all(query, {
    tables: [{ table: 'products' }],
    fuzziness: 0,
    prefix: 'phrase',
  });

  res.status(200).json({
    products: records.map(({ record }) => record)
  });
}