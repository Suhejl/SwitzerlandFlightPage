AOS.init({
  offset: 200,
  delay: 50,
  once: true
});
 
 getTimes = async (filesPath) => {
    return new Promise(resolve => {
        Papa.parse(filesPath, {
            header: true,
            download: true,
            dynamicTyping: true,
            complete: function (results) {
              console.log(results);
              data = results.data;
              var times2 = [];
              data.forEach((item) => {
                times2.push({
                  start: item["start"],
                  end: item["end"],
                });
              });
              resolve(times2)
            },
          });
    });
}

$(document).ready(function () {
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  const id = urlParams.get("id");

  fetch("world_countries.json")
    .then((response) => response.json())
    .then((jsonResponse) => {
      //   console.log(jsonResponse.features)
      jsonResponse.features.forEach((element) => {
        if (element.id === id) {
          generateCards(element);
        }
      });
    });
});

async function  generateCards(feature) {
  const $flights = $("#flights");

  const times = await getTimes('times.csv');

  times.forEach((element) => {
    const innerHtml = displayFlights(feature, element);
    $flights.append(innerHtml);
  });

  //   $("<div></div>", {
  //     class: "card",
  //   }).appendTo("#flights");

  // $flights
  // .append($('div')).attr("class", "card");
}

const displayFlights = (feature, time) => {
  return `
        <div class="card mb-5" data-aos="fade-up">
                <div class="card-header" >
                    <h4 class="card-title">${time.start} - ${time.end}</h4>
                </div>
                <div class="card-body">
                    <h4 class="card-title"><span style="display: inline-flex;vertical-align: middle;">${feature.properties.name}     <i class="material-icons">arrow_forward</i>     Switzerland</span></h4>
                </div>
        </div>
        `;
};
