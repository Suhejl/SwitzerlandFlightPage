 getTimes = async (filesPath) => {

  var times = Papa.parse(filesPath, {
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
      return times2;
    },
  });

  return times;
  //   fetch("times.csv")
  //     .then((response) => response.text())
  //     .then((v) => Papa.parse(v))
  //     .then((elements) => {
  //       var lines = elements.split("\n");
  //       lines.forEach((item, i) => {
  //         if (i !== 0) {
  //           times.push({
  //             start: item[0],
  //             end: item[1],
  //           });
  //         }
  //       });
  //     });
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

function generateCards(feature) {
  const $flights = $("#flights");

  const times = getTimes();

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
        <div class="card">
                <div class="card-header">
                    <h4 class="card-title">${time.start}</h4>
                </div>
                <div class="card-body">
                    <h4 class="card-title"><span style="display: inline-flex;vertical-align: middle;">${feature.properties.name}     <i class="material-icons">arrow_forward</i>     Switzerland</span></h4>
                </div>
        </div>
        `;
};
