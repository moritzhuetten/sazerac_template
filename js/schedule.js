

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


// var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQR_UCg18peMVzHd8e8kSIYrgxJTlEzhHtyrdhxH5LmvaUhdGtplKx0-HVUk1DPkL2ZZqIDtA1cChMI/pub?gid=1602493998&single=true&output=csv';

var csvfile = 'data/schedule.csv'


var tags = ['Astrophysics and Cosmology','Light Dark Matter','Collider Searches','DM Theory','Direct Detection','Indirect Detection','Invited talk','Contributed talk','in person','online'];

var time_zones = ['PST','MST','CST','EST','UTC','CET','IST', 'AWST','JST','AEST'];

var days = ['Tuesday','Wednesday','Thursday','Friday'];

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
    if (i==0) {
    	  tag.innerHTML = '<label><input class="checkbox" type="checkbox" id="'+tag_id+'" name="'+tag_id+'" checked=true> &nbsp;Astro and Cosmo</label>'
    } else if (i==7) {
      tag.innerHTML = '<label style="margin-bottom:80px;"><input class="checkbox" type="checkbox" id="'+tag_id+'" name="'+tag_id+'" checked=true> &nbsp'+tag_id+'</label>'
    } else {
      tag.innerHTML = '<label><input class="checkbox" type="checkbox" id="'+tag_id+'" name="'+tag_id+'" checked=true> &nbsp'+tag_id+'</label>'
    }
    $("#tag_list").append(tag);
    tag_state[tag_id] = true;

  }

  for (i=0; i<4; i++) {
    var tag = document.createElement("li");
    tag.className = 'tag';
    day = i+1;
    tag.innerHTML = '<label><input class="session_checkbox" type="checkbox" id="session'+day+'" name="session'+day+'" checked=true> &nbsp;'+days[i]+'</label>'
    $("#session_list").append(tag);
    session_state['session'+day] = true;
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
      day = i+1;
      session_state['session'+day] = true;
    }
    showInfo();
  });

  $("#check_no_sessions").click(function() {
    $('.session_checkbox').prop('checked', false);
    for (i=0;i<4;i++) {
      day = i+1;
      session_state['session'+day] = false;
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
      var day = parseInt(d['Session'][0]);
      var session = d['Session'][1];
      var talk = parseInt(d['Talk']);

      for (var i=0; i<talk_tags.length; i++) {
        if (tag_state[talk_tags[i].trim()]) {
          inc = true;
        }
      }

      if (inc) {

        if (session_state['session'+day]) {

          if (day != previous_session) {
            tr = table.insertRow(-1);
            var tabCell = tr.insertCell(-1);
            tabCell.colSpan = 4;
            tabCell.innerHTML = '<span style="font-size:22pt;color:#AAA;font-family:Quicksand;">&nbsp;'+days[day-1]+'</span>';
            if (((talk==0 && previous_talk==0) || (talk==1 && previous_talk>=2) || (talk==1 && previous_talk==0))) {
            if (day != 1) {
                tabCell.innerHTML +='<br><span style="color:#AAA;;"><b>&nbsp;&nbsp;9:00 JST: Kashiwa Libary Hall opens.</b></span>';
                } else {
                	tabCell.innerHTML +='<br><span style="color:#AAA;"><b>&nbsp;&nbsp;5:00 UTC / 14:00 JST: Registration at Kashiwa Library Hall opens. Virtual participants can log in to  <a href=https://app.gather.town/events/LtcFlWG-SxKc4XYM9Sg0>Gather.Town</a>.</b></span>';
                }
            }
          } else {
            if (day ==1 && session =='B' && talk== 1) {
              tr = table.insertRow(-1);
              var tabCell = tr.insertCell(-1);
              tabCell.colSpan = 4;
              tabCell.innerHTML = '<span style="color:#AAA;line-height: 3;"><b>&nbsp;&nbsp;08:00 - 08:30 UTC / 17:00 - 17:30 JST: Coffee break.</b></span>';
            }
			else if (day == 2 && session =='B' && talk== 1) {
              tr = table.insertRow(-1);
              var tabCell = tr.insertCell(-1);
              tabCell.colSpan = 4;
              tabCell.innerHTML = '<span style="color:#AAA;line-height: 3;"><b>&nbsp;&nbsp;02:00 - 02:30 UTC / 11:00 - 11:30 JST: Coffee break.</b></span>';
            }
			else if (day == 2 && session =='C' && talk== 1) {
              tr = table.insertRow(-1);
              var tabCell = tr.insertCell(-1);
              tabCell.colSpan = 4;
              tabCell.innerHTML = '<span style="color:#AAA;line-height: 3;"><b>&nbsp;&nbsp;04:00 - 06:00 UTC / 13:00 - 15:00 JST: Lunch break.</b></span>';
            }
			else if (day == 2 && session =='D' && talk== 1) {
              tr = table.insertRow(-1);
              var tabCell = tr.insertCell(-1);
              tabCell.colSpan = 4;
              tabCell.innerHTML = '<span style="color:#AAA;line-height: 3;"><b>&nbsp;&nbsp;08:00 - 09:00 UTC / 17:00 - 18:00 JST:  <a>Poster session on Gather.Town</a> (Africa/Europe friendly).</b></span>';
            }
			else if (day == 3 && session =='B' && talk== 1) {
              tr = table.insertRow(-1);
              var tabCell = tr.insertCell(-1);
              tabCell.colSpan = 4;
              tabCell.innerHTML = '<span style="color:#AAA;line-height: 3;"><b>&nbsp;&nbsp;02:00 - 03:00 UTC / 11:00 - 12:00 JST:  <a>Poster session on Gather.Town</a> (America friendly).</b></span>';
            } else if (day == 3 && session =='C' && talk== 1) {
              tr = table.insertRow(-1);
              var tabCell = tr.insertCell(-1);
              tabCell.colSpan = 4;
              tabCell.innerHTML = '<span style="color:#AAA;line-height: 3;"><b>&nbsp;&nbsp;04:30 - 06:30 UTC / 13:30 - 15:30 JST: Lunch break.</b></span>';
            } else if (day == 3 && session =='D' && talk== 1) {
              tr = table.insertRow(-1);
              var tabCell = tr.insertCell(-1);
              tabCell.colSpan = 4;
              tabCell.innerHTML = '<span style="color:#AAA;line-height: 3;"><b>&nbsp;&nbsp;08:00 - 08:30 UTC / 17:00 - 17:30 JST: Coffee break.</b></span>';
            } else if (day == 4 && session =='B' && talk== 1) {
              tr = table.insertRow(-1);
              var tabCell = tr.insertCell(-1);
              tabCell.colSpan = 4;
              tabCell.innerHTML = '<span style="color:#AAA;line-height: 3;"><b>&nbsp;&nbsp;01:40 - 02:15 UTC / 10:40 - 11:15 JST: Coffee break.</b></span>';
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
            } else if (time<0) {
              time = time + 2400;
              if (time.toString()[2]>=5) {
              time = time - 40;
               }
              time = pad(time, 4)+'-1';
            } else {
              time = pad(time, 4);
            }
            time_list += '<b>'+time_zones[k]+': </b>'+time.slice(0, 2)+':'+time.slice(2, 6)+'<br>';
          }


          var abstract = d['Abstract']
          abstract = abstract.replace(/</g, "&lt;");
          abstract = abstract.replace(/>/g, "&gt;");

          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = '<div class="tooltip"id='+d['Session']+d['Talk']+' class="anchor">'+'&nbsp;&nbsp;'+d['Date']+', '+d['Time'].slice(0, 2)+':'+d['Time'].slice(2, 4)+'<span class="tooltiptext" style="width:100px;">'+time_list+'</span></div>';

          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = '<div class="tooltip"><b>'+d['First Name']+' '+d['Family Name']+ '<span class="tooltiptext" style="width:300px;">'+ d['Institution']+'<br><a href="mailto:'+d['Email']+'">'+d['Email']+'</a></span></div>';

          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = '<div class="tooltip">'+d['Title'] + '<span class="tooltiptext"><b>' + d['Tags']+ '</b><br>' + abstract +'</span></div>';

          var tabCell = tr.insertCell(-1);
          if (d['Slack']) {
          tabCell.innerHTML = '<a href="'+d['Slack']+'" target=_blank><b>Slack channel</b></a>';
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

          previous_session = day;
          previous_talk = talk;

          if ( (day == 1 && session == 'B' && talk == 2) || (day == 2 && session == 'D' && talk == 4) || (day == 3 && session =='D' && talk== 5)) {
            tr = table.insertRow(-1);
            var tabCell = tr.insertCell(-1);
            tabCell.colSpan = 4;
            tabCell.innerHTML +='<span style="color:#AAA;line-height: 3;"><b>&nbsp;&nbsp;10:00 UTC / 19:00 JST: End of the day. Virtual Gather.Town lobby and poster rooms remain open for discussion.</b></span><br><br>';
          } else if (talk==7 && d['Session']=='4B') {
            tr = table.insertRow(-1);
            var tabCell = tr.insertCell(-1);
            tabCell.colSpan = 4;
            tabCell.innerHTML +='<span style="color:#AAA;line-height: 3;"><b>&nbsp;&nbsp;4:00 UTC / 13:00 JST: End of the symposium. <a>Gather.Town  and poster rooms remain open</a>.</b></span><br><br>';
          }

        }

      }

  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  var divContainer = document.getElementById("showData");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);

}
