document.addEventListener("DOMContentLoaded", function () {
  const motionSections = document.querySelectorAll(".process-section");

  if (!motionSections.length) return;

  document.body.classList.add("motion-ready");

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        const section = entry.target;

        if (entry.isIntersecting) {
          section.classList.remove("is-motion");

          // 애니메이션 강제 리셋
          void section.offsetWidth;

          section.classList.add("is-motion");
        } else {
          section.classList.remove("is-motion");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -150px 0px",
    }
  );

  motionSections.forEach(function (section) {
    observer.observe(section);
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const videoFrames = document.querySelectorAll(".video-frame");

  videoFrames.forEach(function (frame) {
    const video = frame.querySelector(".video-guide-video");
    const playButton = frame.querySelector(".video-play-button");

    if (!video || !playButton) return;

    playButton.addEventListener("click", function () {
      video.play();
      video.setAttribute("controls", "controls");
      frame.classList.add("is-playing");
    });

    video.addEventListener("play", function () {
      video.setAttribute("controls", "controls");
      frame.classList.add("is-playing");
    });

    video.addEventListener("pause", function () {
      frame.classList.remove("is-playing");
    });

    video.addEventListener("ended", function () {
      frame.classList.remove("is-playing");
      video.removeAttribute("controls");
      video.currentTime = 0;
    });
  });
});

