const cheerio = require("cheerio");

async function run() {
  const res = await fetch(
    "https://www.bbc.co.uk/news/articles/cqev3v2ygzlvo"
  );

  const html = await res.text();

  const $ = cheerio.load(html);

  let content = "";

  $('[data-testid="rich-text"] p').each((i, el) => {
    content += $(el).text() + "\n\n";
  });

  console.log("LENGTH =", content.length);

  console.log(
    content.substring(0, 1000)
  );
}

run();
