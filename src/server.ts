import http from 'http';
import url from 'url';
import { fetchAndStoreData, store } from './store';

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url!, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (pathname === '/photos' && req.method === 'GET') {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const orderBy = (query.orderBy as string) || 'asc';

    const sortedStore = [...store].sort((a, b) => {
      return orderBy === 'desc' ? b.id - a.id : a.id - b.id;
    });

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = sortedStore.slice(startIndex, endIndex);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      page,
      limit,
      total: store.length,
      data: paginatedData,
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  fetchAndStoreData();

  setInterval(fetchAndStoreData, 60 * 1000);
});
