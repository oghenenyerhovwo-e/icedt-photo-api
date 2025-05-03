import https from 'https';

interface Photo {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  albumId: number;
}

export const store: Photo[] = [];

export const fetchAndStoreData = () => {
  https.get('https://jsonplaceholder.typicode.com/photos', (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const fetched: Photo[] = JSON.parse(data);

        const newData = fetched.filter(item => !store.find(p => p.id === item.id));

        if (newData.length) {
          store.push(...newData);
          console.log(`[✔] Stored ${newData.length} new photos. Total stored: ${store.length}`);
        } else {
          console.log(`[ℹ] No new photos to add.`);
        }

      } catch (error) {
        console.error('[✖] Failed to parse data:', error);
      }
    });
  }).on('error', (err) => {
    console.error('[✖] HTTP Request Failed:', err.message);
  });
};
