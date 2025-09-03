let apiKey = localStorage.getItem('apiKey') || '';

document.getElementById('apiKey').value = apiKey;

document.getElementById('apiKey').addEventListener('input', (e) => {
  apiKey = e.target.value;
  localStorage.setItem('apiKey', apiKey);
});
console.log('xin chao')
document.getElementById('search').addEventListener('click', async () => {
  const queryInput = document.getElementById('query').value.trim();
  const queries = queryInput.split(/\s+/).filter(q => q.trim() && q.startsWith('http'));
  const country = document.getElementById('country').value || 'us';
  const language = document.getElementById('language').value || 'en';
  const dateRange = document.getElementById('dateRange').value;
  const autocorrect = document.getElementById('autocorrect').checked;
  let resultsNum = parseInt(document.getElementById('resultsNum').value);
  let page = parseInt(document.getElementById('page').value);

  if (resultsNum > 10) {
    document.getElementById('credit').classList.remove('hidden');
  } else {
    document.getElementById('credit').classList.add('hidden');
  }

  const results = await Promise.all(queries.map(async q => {
    const data = JSON.stringify({
      q: `site:${q}`,
      gl: country,
      hl: language === 'en' ? undefined : language,
      num: resultsNum,
      autocorrect,
      tbs: dateRange,
      page
    });

    const config = {
      method: 'post',
      url: 'https://google.serper.dev/search',
      headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
      data
    };

    try {
      const response = await axios.request(config);
      return { query: q, data: response.data };
    } catch (error) {
      return { query: q, error: error.message };
    }
  }));

  document.getElementById('results').innerHTML = results.map(r => 
    `<p>${r.query}: ${r.error ? r.error : JSON.stringify(r.data)}</p>`
  ).join('');
});

document.getElementById('pageUp').addEventListener('click', () => {
  let page = parseInt(document.getElementById('page').value);
  page++;
  document.getElementById('page').value = page;
});

document.getElementById('pageDown').addEventListener('click', () => {
  let page = parseInt(document.getElementById('page').value);
  if (page > 1) page--;
  document.getElementById('page').value = page;
});

document.getElementById('resultsNum').addEventListener('change', (e) => {
  if (parseInt(e.target.value) > 10) {
    document.getElementById('credit').classList.remove('hidden');
  } else {
    document.getElementById('credit').classList.add('hidden');
  }
});