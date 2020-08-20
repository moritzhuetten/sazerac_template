



var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQSVI1z0krjanS3xjQY1LoIDPU9gE0OZDy9kGFie9sESOl4ibVdW_tOFgx4SEWf6IAbh5zpG1WQ-pD0/pub?gid=526173983&single=true&output=csv';

// var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRB4E_6RnpLP1wWMjqcwsUvotNATB8Np3OntlXb7066ULcAHI9oqqRhucltFifPTYNd7DRNRE56oTdt/pub?output=csv';

function init() {
  Papa.parse(public_spreadsheet_url, {
    download: true,
    header: true,
    complete: showInfo
  })
}

window.addEventListener('DOMContentLoaded', init)

function showInfo(results) {

  window.data = results.data

  // CREATE DYNAMIC TABLE.
  var table = document.createElement("table");

  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

  var tr = table.insertRow(-1);                   // TABLE ROW.

  var cols = ['Institution', 'Current Position', 'Talk Title'];

  // ADD JSON DATA TO THE TABLE AS ROWS.

  var k = 0;

  for (var i = 0; i < window.data.length; i++) {

      d = window.data[i];

      if (d['Talk Title'].length > 5) {

        k += 1;

        tr = table.insertRow(-1);
        tr.id = i;
        tr.onclick = showTalk;
        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = '<b>'+d['First Name']+' '+d['Family Name']+'</b>';

        for (var j = 0; j < cols.length; j++) {
            col = cols[j];
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = window.data[i][col];
        }

      }

  }

  $('#header').append('<b>'+window.data.length+'</b> people have registered so far.<br>');
  $('#header').append('<b>'+k+'</b> people have submitted abstracts so far.');

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  var divContainer = document.getElementById("showData");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);

}


function showTalk() {

  i = parseInt(this.id);

  var d = window.data[i];

  // history.pushState(null, null, 'index.html?talk='+String(i));

  // document.getElementById("talk_window").innerHTML = '<div id="videoWrapper"><iframe src="https://www.youtube.com/embed/'+xmlDoc.getElementsByTagName('youtube')[i].childNodes[0].nodeValue+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';

  $("#talk_window").append('<div id="talk_close" onclick="close_talk();"><img width="30px" src="images/close.png"></div>');
  // document.getElementById("talk_window").innerHTML += '<div id="talk_close" onclick="close_talk();"><img width="30px" src="images/close.png"></div>';

  $("#talk_speaker").html(d['First Name']+' '+d['Family Name']);
  $("#talk_title").html(d['Talk Title']);
  $("#talk_abstract").html(d['Abstract']);


  $("#talk_background").css("display", "block");
  $("#talk_container").css("display", "block");
  $(window).scrollTop(0);


}


function close_talk() {
  $("#talk_background").css("display", "none");
  $("#talk_container").css("display", "none");
}




window.addEventListener('DOMContentLoaded', init)
