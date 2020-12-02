

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


// var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQR_UCg18peMVzHd8e8kSIYrgxJTlEzhHtyrdhxH5LmvaUhdGtplKx0-HVUk1DPkL2ZZqIDtA1cChMI/pub?gid=1602493998&single=true&output=csv';

var csvfile = 'data/schedule.csv'


var tags = ['DM Astrophysics','Axions & ALPs','Collider searches','DM Theory','Direct Detection','Indirect Detection','Invited talk','Contributed talk','Session A','Session B'];

var time_zones = ['PST','MST','CST','EST','UTC','CET','IST', 'AWST','JST','AEST'];

var days = ['Monday','Tuesday','Wednesday','Thursday'];

var offsets = [-8,-7,-6,-5,0,1,5.3,8,9,10];

var tag_state = {};
var session_state = {};

function init() {

  Papa.parse(csvfile, {
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
    if (i!=7) {
    	    tag.innerHTML = '<label><input class="checkbox" type="checkbox" id="'+tag_id+'" name="'+tag_id+'" checked=true> &nbsp;'+tag_id+'</label>'
    } else {
    	 tag.innerHTML = '<label  style="margin-bottom:80px;"><input class="checkbox" type="checkbox" id="'+tag_id+'" name="'+tag_id+'" checked=true> &nbsp;'+tag_id+'</label>'
    }
    $("#tag_list").append(tag);
    tag_state[tag_id] = true;

  }

  for (i=0; i<4; i++) {
    var tag = document.createElement("li");
    tag.className = 'tag';
    session = i+1;
    tag.innerHTML = '<label><input class="session_checkbox" type="checkbox" id="session'+session+'" name="session'+session+'" checked=true> &nbsp;'+days[i]+'</label>'
    $("#session_list").append(tag);
    session_state['session'+session] = true;
    console.log(i);
  }

}



window.addEventListener('DOMContentLoaded', make_tag_list)


$(document).ready(function() {

  $(".checkbox").change(function() {
    tag_state[this.id] = this.checked;
    showInfo();
  });

  $("#check_all_tags").click(function() {
    $('.checkbox').prop('checked', true);
    for (i=0;i<tags.length;i++) {
      tag_state[tags[i]] = true;
    }
    showInfo();
  });

  $("#check_no_tags").click(function() {
    $('.checkbox').prop('checked', false);
    for (i=0;i<tags.length;i++) {
      tag_state[tags[i]] = false;
    }
    showInfo();
  });


  $(".session_checkbox").change(function() {
    session_state[this.id] = this.checked;
    console.log(session_state);
    showInfo();
  });

  $("#check_all_sessions").click(function() {
    $('.session_checkbox').prop('checked', true);
    for (i=0;i<4;i++) {
      session = i+1;
      session_state['session'+session] = true;
    }
    showInfo();
  });

  $("#check_no_sessions").click(function() {
    $('.session_checkbox').prop('checked', false);
    for (i=0;i<4;i++) {
      session = i+1;
      session_state['session'+session] = false;
    }
    showInfo();
  });





});


function saveData(results) {
    window.data = results.data
    showInfo();
}



function showInfo() {

  // console.log(window.data);

  // CREATE DYNAMIC TABLE.
  var table = document.createElement("table");



  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.


  var previous_session = 0;
  var previous_talk = 0;

  for (var j = 0; j < window.data.length; j++) {



      d = window.data[j];

      console.log(d);

      var inc = false;

      var talk_tags = d['Tags'].split(",");
      var recorded = d['Recorded'];
      var session = parseInt(d['Session'][0]);
      var talk = parseInt(d['Talk']);

      for (var i=0; i<talk_tags.length; i++) {
        if (tag_state[talk_tags[i].trim()]) {
          inc = true;
        }
      }

      if (inc) {

        if (session_state['session'+session]) {

          if (session != previous_session) {
            tr = table.insertRow(-1);
            var tabCell = tr.insertCell(-1);
            tabCell.colSpan = 4;
            tabCell.innerHTML = '<span style="font-size:22pt;color:#888;font-family:Quicksand;">'+days[session-1]+'</span>';
            if (((talk==0 && previous_talk==0) || (talk==1 && previous_talk>=5) || (talk==1 && previous_talk==0)) && d['Session'][1]!='B') {
            if (session != 1) {
                tabCell.innerHTML +='<br><span style="color:#888;"><b><a href=https://spatial.chat/s/dm2020kashiwa target=_blank>SpatialChat</a> lobby and poster rooms are open</b></span>';
                } else {
                	tabCell.innerHTML +='<br><span style="color:#888;"><b><a href=https://spatial.chat/s/dm2020kashiwa target=_blank>SpatialChat</a> lobby and poster rooms open at 9:00 UTC</b></span>';
                }
            }
          } else {
            if (talk==1 && previous_talk==5) {
              tr = table.insertRow(-1);
              var tabCell = tr.insertCell(-1);
              tabCell.colSpan = 4;
              if (session==3) {
              tabCell.innerHTML = '<span style="font-size:16pt;color:#AAA;">Poster session</span> <span style="color:#888;"><b>&nbsp;&nbsp;<a href=https://spatial.chat/s/dm2020kashiwa target=_blank>on SpatialChat</a>. See <a href=posters.html>here</a> for list of posters.</b></span>';
              } else {
              tabCell.innerHTML = '<span style="font-size:16pt;color:#AAA;">Coffee &amp; discussion break</span> <b>&nbsp;&nbsp;<a href=https://spatial.chat/s/dm2020kashiwa target=_blank>on SpatialChat</a></b>';
              }
            }
          }

          tr = table.insertRow(-1);
          tr.id = j;

          time_list = '';

          for (var k=0; k<time_zones.length; k++) {
            time = parseInt(d['Time'])+offsets[k]*100;
            if (time.toString()[2]>5) {
              time = time + 40;
            }
            if (time>=2400) {
              time = time - 2400;
              time = pad(time, 4)+'+1';
            } else {
              time = pad(time, 4);
            }
            time_list += '<b>'+time_zones[k]+': </b>'+time.slice(0, 2)+':'+time.slice(2, 4)+'<br>';
          }


          var abstract = d['Abstract']
          abstract = abstract.replace(/</g, "&lt;");
          abstract = abstract.replace(/>/g, "&gt;");

          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = '<div class="tooltip"id='+d['Session']+d['Talk']+' class="anchor"><!--<a href="https://2020.kashiwa-darkmatter-symposia.org/schedule.html#'+d['Session']+d['Talk']+'" style="text-decoration:none">&#128279;</a> &nbsp;-->'+d['Date']+', '+d['Time'].slice(0, 2)+':'+d['Time'].slice(2, 4)+'<span class="tooltiptext" style="width:100px;">'+time_list+'</span></div>';

          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = '<div class="tooltip"><b>'+d['First Name']+' '+d['Family Name']+ '<span class="tooltiptext" style="width:300px;">'+ d['Institution']+'<br><a href="mailto:'+d['Email']+'">'+d['Email']+'</a></span></div>';

          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = '<div class="tooltip">'+d['Title'] + '<span class="tooltiptext"><b>' + d['Tags']+ '</b><br>' + abstract +'</span></div>';

          var tabCell = tr.insertCell(-1);
          if (d['Pdf']) {
          tabCell.innerHTML = '<a href="'+d['Pdf']+'" target=_blank><b>Talk slides</b></a>';
          }

          var tabCell = tr.insertCell(-1);
          if (d['YouTube']) {
          tabCell.innerHTML = '<a href="'+d['YouTube']+'" target=_blank><b>YouTube</b></a>';
          }
          
          /*var tabCell = tr.insertCell(-1);


          recording = '';
          if (recorded=='Yes') {
            if (d['YouTube']!='') {
                 recording = ' <b><a href="'+d['YouTube']+'">[Recording]</a></b>';
            } else {
                recording =  <b><a href="https://www.youtube.com/channel/UCpjf2aTgzFsVM5lXT6LpgqA", target=_blank>Live stream</a></b>';
            }
          } else {
          	recording = recorded;
          }


          tabCell.innerHTML = recording*/

          previous_session = session;
          previous_talk = talk;

          if (talk==5 && d['Session'][1]=='B' && session != 4 && session != 2) {
            tr = table.insertRow(-1);
            var tabCell = tr.insertCell(-1);
            tabCell.colSpan = 4;
            tabCell.innerHTML +='<span style="color:#888;"><b>Zoom session closing at 13:30 UTC. <a href=https://spatial.chat/s/dm2020kashiwa target=_blank>SpatialChat</a> lobby and poster rooms remain open for discussion</b></span><br><br>';
          } else if (talk==6 && d['Session'][1]=='B' && session == 4) {
            tr = table.insertRow(-1);
            var tabCell = tr.insertCell(-1);
            tabCell.colSpan = 4;
            tabCell.innerHTML +='<span style="color:#888;"><b>Zoom session closing at 13:45 UTC. <a href=https://spatial.chat/s/dm2020kashiwa target=_blank>SpatialChat</a> lobby and poster rooms remain open until the end of the day</b></span><br><br>';
          } else if (talk==6 && d['Session'][1]=='B' && session == 2) {
            tr = table.insertRow(-1);
            var tabCell = tr.insertCell(-1);
            tabCell.colSpan = 4;
            tabCell.innerHTML +='<span style="color:#888;"><b>Zoom session closing at 13:35 UTC. <a href=https://spatial.chat/s/dm2020kashiwa target=_blank>SpatialChat</a> lobby and poster rooms remain open for discussion</b></span><br><br>';
          }

        }

      }

  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  var divContainer = document.getElementById("showData");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);

}
