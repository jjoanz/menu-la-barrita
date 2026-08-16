const { getStore } = require('@netlify/blobs');

function getMenuStore() {
  const siteID = process.env.BLOBS_SITE_ID;
  const token = process.env.BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({ name: 'la-barrita', siteID, token });
  }
  return getStore('la-barrita');
}

exports.handler = async (event) => {
  const store = getMenuStore();

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod === 'GET') {
    const data = await store.get('menu', { type: 'json' });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data || { menu: [], restName: 'La Barrita', catImg: {} }),
    };
  }

  if (event.httpMethod === 'POST') {
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'JSON inválido' }) };
    }
    if (!body || !Array.isArray(body.menu)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Formato inválido: se esperaba { menu: [...], restName: "..." }' }) };
    }
    await store.setJSON('menu', { menu: body.menu, restName: body.restName || 'La Barrita', catImg: body.catImg || {} });
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método no permitido' }) };
};
