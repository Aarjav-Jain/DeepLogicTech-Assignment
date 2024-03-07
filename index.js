import express from "express";
import fetch from "node-fetch";
import cors from "cors";
const app = express();
const PORT = 3000;

app.use(cors());

const getLatestStories = async () => {
  const url = "https://time.com";

  const latestPosts = await fetch(url)
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
      const latestPosts = [];

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

        latestPosts.push({
          title: title,
          link: url + link,
        });
      }
      return latestPosts;
    })
    .catch((error) => {
      console.error(error.message);
    });

  return latestPosts;
};

app.get("/", (req, res) => {
  res.send("Hi there you are on the home route");
});

app.get("/getTimeStories", async (req, res) => {
  const latestStories = await getLatestStories();
  res.json(latestStories);
});

app.listen(PORT, () => {
  console.log("listening at PORT ", PORT);
});
