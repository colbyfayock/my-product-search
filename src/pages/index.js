import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { FaStar, FaCheck } from 'react-icons/fa';
import { useDebouncedCallback } from 'use-debounce';

import { getXataClient } from 'src/lib/xata';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';

import styles from '@styles/Home.module.scss';

export default function Home({ products, categories }) {
  const [searchQuery, setSearchQuery] = useState();
  const [searchCategory, setSearchCategory] = useState();
  const [searchResults, setSearchResults] = useState();
  const [searchCategories, setSearchCategories] = useState();

  const activeProducts = searchResults || products;
  const activeCategories = searchCategories?.filter(({ name }) => !!name) || [];

  // Add debouncing when setting query state to avoid making quick, repetitive
  // requests for every single letter typed

  const debouncedSetSearchQuery = useDebouncedCallback((value) => setSearchQuery(value), 250);

  useEffect(() => {
    if ( !searchQuery && !searchCategory ) {
      setSearchResults(undefined);
      return;
    };

    (async function run() {
      const { products } = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({
          query: searchQuery,
          category: searchCategory
        })
      }).then(r => r.json());
      setSearchResults(products);
    })();
  }, [searchQuery, searchCategory]);

  useEffect(() => {
    (async function run() {
      const { categories } = await fetch('/api/categories').then(r => r.json());
      setSearchCategories(categories);
    })();
  }, []);

  /**
   * handleOnSearch
   */

  function handleOnSearch(e) {
    debouncedSetSearchQuery(e.currentTarget.value);
  }

  /**
   * handleOnCategorySelect
   */

  function handleOnCategorySelect(e) {
    const radio = Array.from(e.currentTarget.elements).find(({ checked }) => checked);
    setSearchCategory(radio.value);
  }

  return (
    <Layout>
      <Head>
        <title>Cool Store</title>
        <meta name="description" content="My cool store!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="sr-only">My Cool Store</h1>

      <Section>
        <Container className={styles.homeContainer}>
          <div className={styles.sidebar}>
            <div className={`${styles.sidebarSection} ${styles.sidebarSearch}`}>
              <form>
                <h2><label>Search</label></h2>
                <input type="search" name="query" onChange={handleOnSearch} />
              </form>
            </div>
            <div className={`${styles.sidebarSection} ${styles.sidebarCategories}`}>
              <h2>Categories</h2>
              <form onChange={handleOnCategorySelect}>
                <ul className={styles.checklist}>
                  <li>
                    <label className={styles.radio}>
                      <input className="sr-only" type="radio" name="category" value={undefined} defaultChecked />
                      <span><FaCheck /></span>
                      All
                    </label>
                  </li>
                  { activeCategories.map(category => {
                    return (
                      <li key={category}>
                        <label className={styles.radio}>
                          <input className="sr-only" type="radio" name="category" value={category.name} />
                          <span><FaCheck /></span>
                          { category.name } ({ category.count })
                        </label>
                      </li>
                    )
                  }) }
                </ul>
              </form>
            </div>
          </div>

          <h2 className="sr-only">Products</h2>

          <ul className={styles.products}>
            {activeProducts.map(product => {
              return (
                <li key={product.id}>
                  <a className={styles.productImageWrapper} href={product.productUrl} rel="noopener noreferrer">
                    <Image width="370" height="640" src={product.image} alt={`${product.productName} Poster`} />
                  </a>
                  <h3 className={styles.productsTitle}>
                    <a href={product.url} rel="noopener noreferrer">{ product.productName }</a>
                  </h3>
                  <p className={styles.productPrice}>
                    {product.sellingPrice}
                  </p>
                </li>
              )
            })}
          </ul>
        </Container>
      </Section>
    </Layout>
  )
}

export async function getStaticProps() {
  const xata = getXataClient();

  const { records: products } = await xata.db.products.getPaginated({
    pagination: {
      size: 15,
    },
  });

  const categories = Array.from(new Set(products.map(({ category }) => category))).filter(c => !!c).sort();

  return {
    props: {
      products,
      categories
    }
  }
}