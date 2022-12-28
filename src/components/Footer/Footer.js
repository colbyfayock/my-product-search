import Container from '@components/Container';

import styles from './Footer.module.scss';

const Footer = ({ ...rest }) => {
  return (
    <footer className={styles.footer} {...rest}>
      <Container className={`${styles.footerContainer} ${styles.footerLegal}`}>
        <p>
          All product data from <a href="https://www.kaggle.com/datasets/promptcloud/amazon-product-dataset-2020">Kraggle</a>
        </p>
        <p>
          &copy; <a href="https://spacejelly.dev">Space Jelly</a>, {new Date().getFullYear()}
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
