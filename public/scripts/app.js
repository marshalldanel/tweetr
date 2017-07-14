$(() => {

////// 
//// #Helper Functions
//////

  $("#nav-bar button").on("click", function () {
    let $textArea = $(".tweet-new > form > textarea");
    $(".tweet-new").slideToggle("slow", function () {
      if ($(".tweet-new").is(":visible")) {
        $textArea.focus();
      }
    });
  });

  function tweetLength(data) {
    let value = $(".tweet-new > form > textarea").val().length;
    if (value < 1 || value > 140) {
      return true;
    } else {
      return false;
    }
  }

  //////
  //// #Tweet Template
  //////

  function escape(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function createTweetElement(tweet) {

    const createdAt = tweet.created_at;
    const newTime = moment(createdAt + 840000);

    const html = `
      <article class="tweets">
        <header>
          <img src=${tweet.user.avatars.small} alt="profile pic">
          <h3>${escape(tweet.user.name)}</h3>
          <p>${escape(tweet.user.handle)}</p>
        </header>
        <main>
          <p>${escape(tweet.content.text)}</p>
        </main>
        <footer>
          <p>${newTime.fromNow()}</p>
          <span class="fa fa-flag" aria-hidden="true"></span>
          <span class="fa fa-retweet" aria-hidden="true"></span>
          <a href="" id="likesButton"><span class="fa fa-heart" aria-hidden="true"></span></a>
        </footer>
      </article>`;
    return html;
  }

  $("#tweets > footer > #likesButton").on("click", function() {
    console.log("hello");
  });

  //////
  //// #Tweet Render/Show
  //////

  function renderTweets(data) {
    let allTweets = '';
    for (const tweet in data) {
      const renderedTweet = createTweetElement(data[tweet]);
      allTweets = renderedTweet + allTweets;
    }
    $('#tweets').empty().append(allTweets);
  }

  function loadTweets() {
    $.ajax({
      type: "GET",
      url: "/tweets"
    })
      .done((data) => {
        renderTweets(data);
      });
  }

  //////
  //// #Tweet Submission
  //////

  function submitTweet(event) {
    event.preventDefault();
    const $form = $(this);
    const data = $form.serialize();

    if (tweetLength() === true) {
      $(".error").show();
      
      setTimeout(function() {
        $(".tweet-new > form > textarea").focus();
        $(".error").hide();
      }, 1500);
    } else {
      $.ajax({
        type: "POST",
        url: $form.attr("action"),
        data: $form.serialize()
      })
        .done(() => {
          loadTweets(data);
          $("#tweetBox").val("");
          $(".counter").text(140);
        });
    }
  }
  
  const $form = $("#newTweet");

  $form.on("submit", submitTweet);

  loadTweets();
});