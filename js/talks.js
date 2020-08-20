


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


var tag_state = {};

function init() {

  document.getElementById('talk_background').onclick = close_talk;

  Papa.parse('data/all.csv', {
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
        tr.onclick = showTalk;

        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = '<div class="tooltip"><b>'+d['First Name']+' '+d['Family Name']+ '<span class="tooltiptext" style="width:300px;">'+ d['Institution']+'<br><a href="mailto:'+d['Email Address']+'">'+d['Email Address']+'</a></span></div>';

        var abstract = d['Abstract']
        abstract = abstract.replace(/</g, "&lt;");
        abstract = abstract.replace(/>/g, "&gt;");

        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = '<div class="tooltip">'+d['Title'] + '<span class="tooltiptext"><b>' + d['Tags']+ '</b><br>' + abstract+'</span></div>';

      }

  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  var divContainer = document.getElementById("showData");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);

}


function showTalk() {

  i = parseInt(this.id);



  var d = window.data[i];

  var abstract = d['Abstract']
  abstract = abstract.replace(/</g, "&lt;");
  abstract = abstract.replace(/>/g, "&gt;");

  if (d['YouTube link'].split('=').length>1) {
    YT = d['YouTube link'].split('=');
  } else {
    YT = d['YouTube link'].split('/');
  }

  $("#talk_window").html('<div id="videoWrapper"><iframe src="https://www.youtube.com/embed/'+YT[YT.length - 1]+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');

  $("#talk_window").append('<div id="talk_close" onclick="close_talk();"><img width="30px" src="images/close.png"></div>');
  // document.getElementById("talk_window").innerHTML += '<div id="talk_close" onclick="close_talk();"><img width="30px" src="images/close.png"></div>';

  $("#talk_speaker").html(d['First Name']+' '+d['Family Name']);
  $("#talk_title").html(d['Title']);
  $("#talk_abstract").html(abstract);

  if (d['Talk slides (optional, PDF only)'].length > 5) {
    $("#talk_slides").html('<a href="'+d['Talk slides (optional, PDF only)']+'">Download Slides</a>');
  } else {
    $("#talk_slides").html('');
  }


  $("#talk_background").css("display", "block");
  $("#talk_container").css("display", "block");
  $(window).scrollTop(0);


}


function close_talk() {
  $("#talk_window").html('');
  $("#talk_background").css("display", "none");
  $("#talk_container").css("display", "none");
}




window.addEventListener('DOMContentLoaded', init)
