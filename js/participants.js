




// var public_spreadsheet_url = 'https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vQFJ9Rl-4lZ1gwFdV6KGmL7p7XT1KS84o5gd4njT0S5KhHk-zEW8dgESj6F2zQu-qopYqAsJ5GAkUIH/pub?gid=1488898563&single=true&output=csv';

function init() {
  console.log('here');
  Papa.parse('data/participants.csv', {
    download: true,
    header: true,
    complete: showInfo
  })
}

window.addEventListener('DOMContentLoaded', init)

function showInfo(results) {

  console.log('here2');

  window.data = results.data;

  console.log(window.data);

  $('#header').append('<h5><b>'+window.data.length+'</b> people from 33 countries have registered.</h5>');

    window.data.sort(function(a, b) {
      return a['Family Name'] > b['Family Name'];
  });

  // CREATE DYNAMIC TABLE.
  var table = document.createElement("table");

  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

  var tr = table.insertRow(-1);                   // TABLE ROW.

  var cols = ['Affiliation', 'Current Position', 'Talk Title'];

  // ADD JSON DATA TO THE TABLE AS ROWS.
  for (var i = 0; i < window.data.length; i++) {
      tr = table.insertRow(-1);
      tr.id = i;
      d = window.data[i];

      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = '<b>'+d['First Name']+' '+d['Family Name']+'</b>';

      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = d['Affiliation']+', '+d['Country of your affiliation'];

  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  var divContainer = document.getElementById("showData");
  divContainer.innerHTML = "";

  divContainer.appendChild(table);

}

window.addEventListener('DOMContentLoaded', init)
