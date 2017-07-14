$(() => {

  function escape(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msForTwoMins = msPerMinute * 2;

    var msPerHour = msPerMinute * 60;
    var msForTwoHours = msPerHour * 2;

    var msPerDay = msPerHour * 24;
    var msForTwoDays = msPerDay * 2;

    var msPerMonth = msPerDay * 30;
    var msForTwoMonths = msPerMonth * 2;

    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;


    switch (true) {
    case elapsed < msForTwoMins:
      return "1 minute ago";
    case elapsed < msPerHour:
      return Math.round(elapsed / msPerMinute) + " minutes ago";
    case elapsed < msForTwoHours:
      return "1 hour ago";
    case elapsed < msPerDay:
      return Math.round(elapsed / msPerHour) + " hours ago";
    case elapsed < msForTwoDays:
      return "1 day ago";
    case elapsed < msPerMonth:
      return Math.round(elapsed / msPerDay) + " days ago";
    case elapsed < msForTwoMonths:
      return "1 month ago";
    default:
      return Math.round(elapsed / msPerYear ) + " year ago";
    }
  }

  function createTweetElement(tweet) {
    const currentDate = (new Date());
    const createdAt = tweet.created_at;
    const newTime = timeDifference(currentDate, createdAt);
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
          <p>${newTime}</p>
          <span class="fa fa-flag" aria-hidden="true"></span>
          <span class="fa fa-retweet" aria-hidden="true"></span>
          <a href="#"><span id="likes" class="fa fa-heart" aria-hidden="true"></span></a>
        </footer>
      </article>`;
    return html;
  }

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

  function tweetLength(data) {
    let value = $(".tweet-new > form > textarea").val().length;
    if (value < 1 || value > 140) {
      return true;
    } else {
      return false;
    }
  }

  $(".compose").on("click", function () {
    let $textArea = $(".tweet-new > form > textarea");
    $(".tweet-new").slideToggle("slow", function () {
      if ($(".tweet-new").is(":visible")) {
        $textArea.focus();
      }
    });
  });

  

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