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