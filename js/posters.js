


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


var tags = ['Analogues','Reionization','Dark ages','First stars','AGN','Star formation histories','Metal/dust enrichment','Escape fractions','Theory','Observations','Tools','Outreach and diversity','Other'];


public_spreadsheet_url = 'https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vTiCh2eEGbqIqyabmOoT9t89ILSYJbcO84npWnnPBdDpv8KR8TigDNZvAgioASBWp6CDQ4FT7Bw6gY0/pub?gid=900996784&single=true&output=csv'


var tag_state = {};

function init() {

  Papa.parse(public_spreadsheet_url, {
    download: true,
    header: true,
    complete: saveData
  })
}

window.addEventListener('DOMContentLoaded', init)



function make_tag_list() {

  for (i=0; i<tags.length; i++) {
    tag_id = tags[i];
    var tag = document.createElement("li");
    tag.className = 'tag';
    tag.innerHTML = '<label><input class="checkbox" type="checkbox" id="'+tag_id+'" name="'+tag_id+'" checked=true> &nbsp;'+tag_id+'</label>'
    $("#tag_list").append(tag);
    tag_state[tag_id] = true;
    console.log(tag_id, tag_state[tag_id])
  }
}



window.addEventListener('DOMContentLoaded', make_tag_list)


$(document).ready(function() {

  $(".checkbox").change(function() {
    tag_state[this.id] = this.checked;
    showInfo();
  });


  $("#check_all").click(function() {
    $('.checkbox').prop('checked', true);

    for (i=0;i<tags.length;i++) {
      tag_state[tags[i]] = true;
    }
    showInfo();
  });

  $("#check_none").click(function() {
    $('.checkbox').prop('checked', false);
    for (i=0;i<tags.length;i++) {
      tag_state[tags[i]] = false;
    }
    showInfo();
  });

});


function saveData(results) {
    window.data = shuffle(results.data)
    showInfo();
}



function showInfo() {

  console.log(window.data);

  // CREATE DYNAMIC TABLE.
  var table = document.createElement("table");

  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

  for (var j = 0; j < window.data.length; j++) {

      d = window.data[j];
      console.log(d);

      var inc = false;

      var talk_tags = d['Tags'].split(",");

      for (var i=0; i<talk_tags.length; i++) {
        if (tag_state[talk_tags[i].trim()]) {
          inc = true;
        }
      }


      if (inc) {

        tr = table.insertRow(-1);
        tr.id = j;

        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = '<div class="tooltip"><b>'+d['First Name']+' '+d['Family Name']+ '<span class="tooltiptext" style="width:300px;">'+ d['Institution']+'<br><a href="mailto:'+d['Email']+'">'+d['Email']+'</a></span></div>';

        var abstract = d['Abstract']
        abstract = abstract.replace(/</g, "&lt;");
        abstract = abstract.replace(/>/g, "&gt;");

        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = '<div class="tooltip">'+d['Title'] + '<span class="tooltiptext"><b>' + d['Tags']+ '</b><br>' + abstract+'</span></div>';

        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = '<a href="'+d['PDF']+'"><b>[Download Poster]</b></a>';

      }

  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  var divContainer = document.getElementById("showData");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);

}
