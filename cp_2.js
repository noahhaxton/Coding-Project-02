// Coding Project 02 — Product Dashboard
// Uses both .then()/.catch() and async/await patterns against the Store Products API.

const API_URL = 'https://www.course-api.com/javascript-store-products';

function handleError(error) {
  console.error('An error occurred: ' + error.message);
  const container = document.getElementById('product-container');
  if (container) {
    container.innerHTML = `
      <div class="error">An error occurred: ${error.message}</div>
    `;
  }
}

function getName(product) {
  return (
    product?.name ||
    product?.title ||
    product?.fields?.name ||
    'Unnamed Product'
  );
}

function getPrice(product) {
  const raw = product?.price ?? product?.fields?.price;
  if (typeof raw === 'number') {
    return raw >= 1000 ? raw / 100 : raw;
  }
  return NaN;
}

function getImage(product) {
  if (product?.image?.url) return product.image.url;
  if (Array.isArray(product?.images) && product.images[0]?.url)
    return product.images[0].url;
  if (product?.fields?.image) {
    const img = product.fields.image;
    if (Array.isArray(img)) {
      if (img[0]?.url) return img[0].url;
      if (img[0]?.thumbnails?.large?.url) return img[0].thumbnails.large.url;
    } else if (img.url) {
      return img.url;
    }
  }
  if (typeof product?.image === 'string') return product.image;
  return 'https://via.placeholder.com/600x400?text=No+Image';
}

function fetchProductsThen() {
  fetch(API_URL)
    .then((res) => {
      if (!res.ok) throw new Error('Network error: ' + res.status);
      return res.json();
    })
    .then((data) => {
      data.slice(0, 5).forEach((p, i) => {
        console.log(`Product ${i + 1}: ${getName(p)}`);
      });
    })
    .catch(handleError);
}

async function fetchProductsAsync() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Network error: ' + res.status);
    const data = await res.json();
    displayProducts(data);
  } catch (err) {
    handleError(err);
  }
}

function displayProducts(products) {
  const container = document.getElementById('product-container');
  if (!container) return;

  container.innerHTML = '';

  products.slice(0, 5).forEach((p) => {
    const card = document.createElement('article');
    card.className = 'product-card';

    const img = document.createElement('img');
    img.src = getImage(p);
    img.alt = getName(p);

    const content = document.createElement('div');
    content.className = 'content';

    const name = document.createElement('h3');
    name.className = 'name';
    name.textContent = getName(p);

    const price = document.createElement('p');
    price.className = 'price';
    const val = getPrice(p);
    price.textContent = isNaN(val) ? 'Price: —' : `Price: $${val.toFixed(2)}`;

    content.appendChild(name);
    content.appendChild(price);

    card.appendChild(img);
    card.appendChild(content);

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchProductsThen();
  fetchProductsAsync();
});