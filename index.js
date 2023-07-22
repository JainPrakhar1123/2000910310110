const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

app.get('/numbers', async (req, res) => {
  try {
    const urlList = req.query.url;

    if (!urlList || !Array.isArray(urlList) || urlList.length === 0) {
      return res.status(400).json({ error: 'No URLs provided' });
    }

    const combinedNumbers = [];

    for (const url of urlList) {
      try {
        const response = await axios.get(url);

        if (response.status === 200) {
          const { numbers } = response.data;
          combinedNumbers.push(...numbers);
        } else {
          return res
            .status(500)
            .json({ error: `Failed to fetch data from URL: ${url}` });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ error: `Failed to fetch data from URL: ${url}` });
      }
    }

    // Sort the combined numbers array in ascending order and remove duplicates
    const sortedNumbers = [...new Set(combinedNumbers)].sort(
      (a, b) => a - b
    );

    return res.json({ numbers: sortedNumbers });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
