"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName(story.url);
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <button class="favorite-button">&hearts;</button>
        <button class="delete-button"> X </button>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}



function submitStory(evt) {
  console.debug("submitStory");
  evt.preventDefault();

  const title = document.getElementById('story-title').value;
  const url = document.getElementById('story-url').value;
  const author = document.getElementById('author-name').value;
  const username = currentUser.username;
  const storyData = { title, url, author, username };

  storyList.addStory(currentUser, storyData)
    .then(story => {
      
      const storyMarkup = generateStoryMarkup(story);
      $allStoriesList.insertBefore(storyMarkup, $allStoriesList.firstChild);

    })
    .catch(error => {
      console.error('Oops! Error creating story:', error);
      
    });
}

$storyForm.submit(submitStory);

$story.find('.favorite-button').on('click', () => {
  addFavorite(storyId);
});

$story.find('.delete-button').on('click', () => {
  deleteStory(storyId)
});




/* const storyForm = document.getElementById('story-form');

storyForm.addEventListener('submit', async function(event) {
  event.preventDefault();

  const title = document.getElementById('story-title').value;
  const url = document.getElementById('story-url').value;
  const author = document.getElementById('author-name').value;
  const storyData = {title, url, author, username};

  try {
    const createdStory = await storyList.addStory(title, url, author);
    console.log('Story created:', createdStory);
    // Handle successful story creation, e.g., update UI, display success message, etc.
  } catch (error) {
    console.error('Error creating story:', error);
    // Handle error, e.g., display error message to the user
  }
}); */