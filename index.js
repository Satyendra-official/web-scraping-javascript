const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function scrapeSite(keyword) {
    const url = `https://www.google.com/search?q=${keyword}&tbm=isch`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const results = [];

    	$('table.RntSmf').each((i, elem) => {
		const imgSrc = $(elem).find('img').attr('src');
		const text = $(elem).find('span:first-child').text();
		results.push({ imgSrc, text });
	});
    // $("img").each((i, elem) => {
    //     const imgSrc = $(elem).attr("src");
    //     const altText = $(elem).attr("alt") || "No description";
    //     if (imgSrc) {
    //         results.push({ imgSrc, altText });
    //     }
    // });

    return results;
}

// Function to export data to CSV
function exportToCSV(data, filename = "output.csv") {
    const csvContent = [
        "Image URL,Alt Text",
        ...data.map(row => `"${row.imgSrc}","${row.text}"`)
    ].join("\n");

    fs.writeFileSync(filename, csvContent);
    console.log(`CSV file "${filename}" has been saved!`);
}

// Run the scraping and export to CSV
const keyword = "coffee"; 
scrapeSite(keyword)
    .then((result) => {
        console.log("Scraped Data:", result);
        exportToCSV(result, "images.csv");
    })
    .catch((err) => console.log("Error:", err));

