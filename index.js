import express from "express";
import fetch from "node-fetch";
const app = express();
const PORT = 3000;

function getLatestStories() {
  const url = "https://time.com";

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error(
          `Failed to fetch content. Status code: ${response.status}`
        );
      }
    })
    .then((htmlContent) => {
      const searchString = '<li class="latest-stories__item">';
      let storyIndex = htmlContent.indexOf(searchString);
      const allStoriesIndex = [];
      while (storyIndex !== -1) {
        allStoriesIndex.push(storyIndex);
        storyIndex = htmlContent.indexOf(searchString, storyIndex + 1);
      }

      //   console.log(allStoriesIndex);

      const links = [];
      const titles = [];

      for (let i = 0; i <= 5; ++i) {
        /// ADDING LINKS ///
        const anchorString = '<a href="';
        let startIndexLink = htmlContent.indexOf(
          anchorString,
          allStoriesIndex[i]
        );
        let endIndexLink = htmlContent.indexOf('">', startIndexLink);
        const link = htmlContent
          .slice(startIndexLink, endIndexLink)
          .split(anchorString)[1];

        /// ADDING TITLES ///
        const titleString = '<h3 class="latest-stories__item-headline">';
        let startIndexTitle = htmlContent.indexOf(
          titleString,
          allStoriesIndex[i]
        );
        let endIndexTitle = htmlContent.indexOf("</h3>", startIndexTitle);
        const title = htmlContent
          .slice(startIndexTitle, endIndexTitle)
          .split(titleString)[1];

        links.push(url + link);
        titles.push(title);
      }
      //   console.log(titles, links);
    })
    .catch((error) => {
      console.error(error.message);
    });
}

app.get("/", (req, res) => {
  getLatestStories();
  res.send("HI there");
});

app.listen(PORT, () => {
  console.log("listening at PORT ", PORT);
});
