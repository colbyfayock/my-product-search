import { getXataClient } from 'src/lib/xata';

const xata = getXataClient();

export default async function handler(req, res) {
  const { aggs } = await xata.db.products.aggregate({
    categories: {
      topValues: {
        column: 'category'
      }
    }
  });

  const categories = aggs.categories.values.map(category => {
    return {
      name: category.$key,
      count: category.$count
    }
  });

  res.status(200).json({ categories })
}