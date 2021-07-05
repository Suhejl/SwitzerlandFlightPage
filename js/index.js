const $backTop = $(".back-to-top");
const isHidden = "is-hidden";

AOS.init({
  offset: 200,
  delay: 50,
  once: true
});

/*$('a[data-toggle="pill"]').on("shown.bs.tab", e => {
  AOS.refresh();
});*/

$(window).on("scroll", function() {
  const $this = $(this);
  if ($this.scrollTop() + $this.height() <= $(document).height() + 200) {
    $backTop.addClass(isHidden);
  } else {
    $backTop.removeClass(isHidden);
  }
});

$backTop.on("click", () => {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  return false;
});

$(document).ready(() =>{
  if(window.location.protocol === 'file:'){
    alert("We are using fetch() to load files. But this doesn't work on local. Please open Project with Live Server in VS Code")
  }
})