const fetchMovies = () => {
  fetch('https://fuggo.lol:4000/hellofuggomayihaveyourtheatrespliasixd')
  .then( response => response.json() )
  .then( json => {
      localStorage.setItem('events', JSON.stringify(json));
  })
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 1000);
  });
  
}
  
const calendarApp = () => {
  let tempHolidays = localStorage.getItem("events");
  const calendar = document.querySelector("#calendar");
  const monthBanner = document.querySelector("#month");
  let navigation = 0;
  let clicked = null;
  let events = localStorage.getItem("events") ? JSON.parse(localStorage.getItem("events")) : [];
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Le Friday", "Saturday"];

  function formatTime(timeString) {
    const [hourString, minute] = timeString.split(":");
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
}
  function loadCalendar() {
    const dt = new Date();
  
    if (navigation != 0) {
      dt.setMonth(new Date().getMonth() + navigation);
    }
    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();
    monthBanner.innerText = `${dt.toLocaleDateString("en-us", {
      month: "long",
    })} ${year}`;
    calendar.innerHTML = "";
    const dayInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayofMonth = new Date(year, month, 1);
    const dateText = firstDayofMonth.toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    
    const dayString = dateText.split(", ")[0];
    const emptyDays = weekdays.indexOf(dayString);
  
    for (let i = 1; i <= dayInMonth + emptyDays; i++) {
      const dayBox = document.createElement("div");
      dayBox.classList.add("day");
      const monthVal = month + 1 < 10 ? "0" + (month + 1) : month + 1;
      const dateVal = i - emptyDays < 10 ? "0" + (i - emptyDays) : i - emptyDays;
      const dateText = `${year}-${monthVal}-${dateVal}`;
      if (i > emptyDays) {
        dayBox.innerText = i - emptyDays;
        //Event Day
        const eventOfTheDay = [];
        events.forEach(event1 => {
          if (event1.Date == dateText) {
            eventOfTheDay.push(event1);
          }
        })
        eventOfTheDay.sort(function(a,b) {
          return new Date ('1/1/1999 ' + a.Time) > new Date ('1/1/1999 ' + b.Time)
        });

        // const holidayOfTheDay = holidays.find((e) => e.hdate == dateText);
        
        if (i - emptyDays === day && navigation == 0) {
          dayBox.id = "currentDay";
        }
        
        if (eventOfTheDay) {
          let noRerunsList = [];
          let notaRerun = true;
          eventOfTheDay.forEach(event2 => {
            noRerunsList.forEach(element => {
              if (element.Title == event2.Title && element.Time == event2.Time && element.Date == event2.Date && element.Location == event2.Location) {
                notaRerun = false;
              }
            });
            if (notaRerun) {
              const eventDiv = document.createElement("div");
              eventDiv.classList.add("event");

              if (event2.Location == "Hot Docs") {
                // eventDiv.style.backgroundColor = "#aebb00";
                eventDiv.classList.add("event-HotDocs");

              }
              if (event2.Location == 'The TIFF "formerly Bell" Lightbox') {
                eventDiv.classList.add("event-TIFF"); }

              if (event2.Location == "The Revue") {
                  eventDiv.classList.add("event-Revue"); }

              if (event2.Location == "Paradise Theatre") {
                eventDiv.classList.add("event-Paradise"); }

              
              if (event2.Location == "Imagine Cinemas - Carlton Street") {
                eventDiv.classList.add("event-Carlton"); }

              if (event2.Location == "Imagine Cinemas - Front Street") {
                eventDiv.classList.add("event-Front"); }

  
              
              const realTime = formatTime(event2.Time);
              eventDiv.innerText = realTime + " - " + event2.Title;
              dayBox.appendChild(eventDiv);
              eventDiv.addEventListener("click", () => {
                showModal(event2.Title, event2.Time, event2.Location, event2.URL);
              });
  
            }
            noRerunsList.push(event2);
            notaRerun = true;
          });
        }
        // if (holidayOfTheDay) {
        //   const eventDiv = document.createElement("div");
        //   eventDiv.classList.add("event");
        //   eventDiv.classList.add("holiday");
        //   eventDiv.innerText = holidayOfTheDay.holiday;
        //   dayBox.appendChild(eventDiv);
        // }
  

      } 
      else {
        dayBox.classList.add("plain");
      }
      calendar.append(dayBox);
    }
  }
  function buttons() {
    const btnBack = document.querySelector("#btnBack");
    const btnNext = document.querySelector("#btnNext");
    const btnDelete = document.querySelector("#btnDelete");
    const btnSave = document.querySelector("#btnSave");
    const closeButtons = document.querySelectorAll(".btnClose");
    const txtTitle = document.querySelector("#txtTitle");
  
    btnBack.addEventListener("click", () => {
      navigation--;
      loadCalendar();
    });
    btnNext.addEventListener("click", () => {
      navigation++;
      loadCalendar();
    });
    modal.addEventListener("click", closeModal);
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", closeModal);
      
    });
    // btnDelete.addEventListener("click", function () {
    //   events = events.filter((e) => e.Date !== clicked);
    //   localStorage.setItem("events", JSON.stringify(events));
    //   closeModal();
    // });
    
    btnSave.addEventListener("click", function () {
      if (txtTitle.value) {
        txtTitle.classList.remove("error");
        events.push({
          date: clicked,
          title: txtTitle.value.trim(),
        });
        txtTitle.value = "";
        localStorage.setItem("events", JSON.stringify(events));
        closeModal();
      } else {
        txtTitle.classList.add("error");
      }
    });
  }
  
  const modal = document.querySelector("#modal");
  const viewEventForm = document.querySelector("#viewEvent");
  const addEventForm = document.querySelector("#addEvent");
  
  function showModal( eventTitle, eventTime, eventLocation, eventURL) {
    const eventOfTheDay = events.find((e) => e.Title == eventTitle && e.Time == eventTime && e.Location == eventLocation);
    if (eventOfTheDay) {
      const functionAddGoToButton = () => {
          window.open(eventOfTheDay.URL);
          btnDelete.removeEventListener("click", functionAddGoToButton);
          closeModal();
      }
      document.querySelector("#eventHeader").innerText = eventOfTheDay.Location;
      document.querySelector("#eventText").innerText = eventOfTheDay.Time + " : " + eventOfTheDay.Title;
      btnDelete.removeEventListener("click", functionAddGoToButton);

      btnDelete.addEventListener("click", functionAddGoToButton);
      viewEventForm.style.display = "block";
    } else {
      addEventForm.style.display = "block";
    }
    modal.style.display = "block";
  }
  
  //Close Modal
  function closeModal() {
    btnDelete.replaceWith(btnDelete.cloneNode(true));
    viewEventForm.style.display = "none";
    addEventForm.style.display = "none";
    modal.style.display = "none";
    clicked = null;
    // loadCalendar();
  }
  
  buttons();
  loadCalendar();
  
// Everything related to the sidebar goes here.

}

function two() {//this function takes 2 seconds

}

async function asyncCall() {
  const result = await fetchMovies();
calendarApp();  // expected output: 'resolved'
}

function openNav() {
  document.getElementById("mySidebar").style.width = "345px";
  document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
} 

let hiddenFront = false;
document.getElementById('frontSideBarLabel').onclick = function hide() {
  if (!hiddenFront) {
    document.querySelectorAll('.event-Front').forEach(el => el.hidden = true);
    document.getElementById('frontSideBarLabel').style.textDecoration = "line-through";
    document.getElementById('frontSideBarLabel').style.color = "gray";


    hiddenFront = true;
  }
  else {
    document.querySelectorAll('.event-Front').forEach(el => el.hidden = false);
    document.getElementById('frontSideBarLabel').style.textDecoration = "none";
    document.getElementById('frontSideBarLabel').style.color = "white";

    hiddenFront = false;
  }
}

let hiddenCarlton = false;
document.getElementById('carltonSideBarLabel').onclick = function hide() {
  if (!hiddenCarlton) {
    document.querySelectorAll('.event-Carlton').forEach(el => el.hidden = true);
    document.getElementById('carltonSideBarLabel').style.textDecoration = "line-through";
    document.getElementById('carltonSideBarLabel').style.color = "gray";

    hiddenCarlton = true;
  }
  else {
    document.querySelectorAll('.event-Carlton').forEach(el => el.hidden = false);
    document.getElementById('carltonSideBarLabel').style.textDecoration = "none";
    document.getElementById('carltonSideBarLabel').style.color = "white";


    hiddenCarlton = false;
  }
}

let hiddenRevue = false;
document.getElementById('revueSideBarLabel').onclick = function hide() {
  if (!hiddenRevue) {
    document.querySelectorAll('.event-Revue').forEach(el => el.hidden = true);
    document.getElementById('revueSideBarLabel').style.textDecoration = "line-through";
    document.getElementById('revueSideBarLabel').style.color = "gray";

    hiddenRevue = true;
  }
  else {
    document.querySelectorAll('.event-Revue').forEach(el => el.hidden = false);
    document.getElementById('revueSideBarLabel').style.textDecoration = "none";
    document.getElementById('revueSideBarLabel').style.color = "white";


    hiddenRevue = false;
  }
}

let hiddenParadise = false;
document.getElementById('paradiseSideBarLabel').onclick = function hide() {
  if (!hiddenParadise) {
    document.querySelectorAll('.event-Paradise').forEach(el => el.hidden = true);
    document.getElementById('paradiseSideBarLabel').style.textDecoration = "line-through";
    document.getElementById('paradiseSideBarLabel').style.color = "gray";

    hiddenParadise = true;
  }
  else {
    document.querySelectorAll('.event-Paradise').forEach(el => el.hidden = false);
    document.getElementById('paradiseSideBarLabel').style.textDecoration = "none";
    document.getElementById('paradiseSideBarLabel').style.color = "white";

    hiddenParadise = false;
  }
}

let hiddenTIFF = false;
document.getElementById('tiffSideBarLabel').onclick = function hide() {
  if (!hiddenTIFF) {
    document.querySelectorAll('.event-TIFF').forEach(el => el.hidden = true);
    document.getElementById('tiffSideBarLabel').style.textDecoration = "line-through";
    document.getElementById('tiffSideBarLabel').style.color = "gray";

    hiddenTIFF = true;
  }
  else {
    document.querySelectorAll('.event-TIFF').forEach(el => el.hidden = false);
    document.getElementById('tiffSideBarLabel').style.textDecoration = "none";
    document.getElementById('tiffSideBarLabel').style.color = "white";


    hiddenTIFF = false;
  }
}

let hiddenHotDocs = false;
document.getElementById('hotdocsSideBarLabel').onclick = function hide() {
  if (!hiddenHotDocs) {
    document.querySelectorAll('.event-HotDocs').forEach(el => el.hidden = true);
    document.getElementById('hotdocsSideBarLabel').style.textDecoration = "line-through";
    document.getElementById('hotdocsSideBarLabel').style.color = "gray";

    hiddenHotDocs = true;
  }
  else {
    document.querySelectorAll('.event-HotDocs').forEach(el => el.hidden = false);
    document.getElementById('hotdocsSideBarLabel').style.textDecoration = "none";
    document.getElementById('hotdocsSideBarLabel').style.color = "white";



    hiddenHotDocs = false;
  }
}
asyncCall();
