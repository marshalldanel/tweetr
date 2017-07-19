$(() => {

////// 
//// #Helper Functions
//////

  $("#nav-bar button").on("click", function () {
    let $textArea = $("#tweetBox");
    $(".tweet-new").slideToggle("slow", function () {
      if ($(".tweet-new").is(":visible")) {
        $textArea.focus();
      }
    });
  });

  function tweetLength(data) {
    let value = $("#tweetBox").val().length;
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
    const newTime = moment(createdAt);

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
          <span class="fa fa-heart" aria-hidden="true"></span>
        </footer>
      </article>`;
    return html;
  }

  //////
  //// #Tweet Render/Show
  //////

  function renderTweets(data) {
    data.forEach((tweet) => {
      $("#tweets").prepend(createTweetElement(tweet));
    });
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
        $("#tweetBox").focus();
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