console.log("Heyy");

let currentSong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder){

    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    songs = []

    for(let index =0;index<as.length;index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])     
        }
        //  **** return songs;
        console.log("song fetched ",songs);
    }


    // **** let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    // for (const song of songs) {
    //     songUL.innerHTML = songUL.innerHTML + `<li>        
    //                             <div class="info">
    //                                 <div>${song.replaceAll("%20"," ")}</div>
    //                                 <div>music</div>
    //                             </div>
    //                             <div class="playnow">
    //                                 <span>Play Now</span>
    //                                 <img class="invert" src="play.svg" width="26" alt="">
    //                             </div>
    //                          </li>`;
    // }

    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>music</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="play.svg" width="26" alt="">
                </div>
            </li>`;
    }

    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const track = e.querySelector(".info").firstElementChild.innerHTML.trim();
            console.log("Playing:", track);
            playMusic(track);
        });
    });


    //**** */ Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    //     e.addEventListener("click",element => {
    //         console.log(e.querySelector(".info").firstElementChild.innerHTML)
    //         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            
    //     })
        
    // })

     return songs;
}

const playMusic = (track,pause=false) =>{
    // let audio = new Audio("/Songs" + track)
    currentSong.src = `/${currfolder}/` + track
    if(!pause){
        currentSong.play();  
    }
    play.src = "pause.svg" 
    document.querySelector(".songInfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00/00:00"
}
 

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/Songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
            const e= array[index];   
     

        if(e.href.includes("/Songs")){
           let folder =  e.href.split("/").slice(-2)[0]
           let a = await fetch(`http://127.0.0.1:3000/Songs/${folder}/info.json`)
           let response = await a.json()
           console.log(response)
           cardContainer.innerHTML = cardContainer.innerHTML+`<div data-folder="${folder}" class="card ">
                            <div  class="play">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none">
                                    <!-- Solid Green Circle -->
                                    <circle cx="12" cy="12" r="12" fill="green" />
                                    <!-- Solid Black Play Button -->
                                    <path d="M9 8L16 12L9 16Z" fill="black" />
                                </svg>
                                
                            </div>
                            <img src="/Songs/${folder}/cover.jpg" alt="Happy">
                            <h2>${response.title}</h2>
                            <p>${response.description}</p>
                        </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

}

async function main (){

    // get the list of songs
    await getSongs("Songs/ncs")
    playMusic(songs[0],true)
    // console.log(songs)

    // show all the songs in your lsibrary -->>

    // let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    // for (const song of songs) {
    //     songUL.innerHTML = songUL.innerHTML + `<li>        
    //                             <div class="info">
    //                                 <div>${song.replaceAll("%20"," ")}</div>
    //                                 <div>music</div>
    //                             </div>
    //                             <div class="playnow">
    //                                 <span>Play Now</span>
    //                                 <img class="invert" src="play.svg" width="26" alt="">
    //                             </div>
    //                          </li>`;
    // }


    // Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    //     e.addEventListener("click",element => {
    //         console.log(e.querySelector(".info").firstElementChild.innerHTML)
    //         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            
    //     })
        
    // })


    // play the song -->>

    // var audio = new Audio(songs[0]);
    // audio.play();

    // audio.addEventListener("loadeddata",()=>{
        
    //     console.log(audio.duration,audio.currentSrc,audio.currentTime);
    // });


    // display all the album on the page -->>

    displayAlbums();


    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg"
        }else{
            currentSong.pause();
            play.src = "play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });
    
    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });
  

    document.querySelector(".humburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = 0;
    })
    
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%";
    })


    // prev next -->>

    // previous.addEventListener("click",()=>{
    //     console.log("Previous song");
    //     // let index = songs.indexOf(        currentSong.src.split("/").slice(-1)[0])
    //     let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/Songs/")[1]));

    //     if((index-1)>=0){
    //         playMusic(songs[index-1])
    //     }
    // })

    // next.addEventListener("click",()=>{
    //     console.log("Next song")
    //     console.log(currentSong.src)
    //     // let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    //     let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/Songs/")[1]));

    //     if((index+1)>length){
    //         playMusic(songs[index+1])
    //     }
    // })  


// Previous Button
// previous.addEventListener("click", () => {
//     currentSong.pause()
//     console.log("Previous clicked")
//     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
//     if ((index - 1) >= 0) {
//         playMusic(songs[index - 1])
//     }
// })

// // Add an event listener to next
// next.addEventListener("click", () => {
//     currentSong.pause()
//     console.log("Next clicked")

//     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
//     if ((index + 1) < songs.length ) {
//         playMusic(songs[index + 1])
//     }
// })


document.getElementById('next').addEventListener('click', () => {
    if (!songs || songs.length === 0) {
        console.error("No songs loaded.");
        return;
    }
    currentIndex = (currentIndex + 1) % songs.length; // Move to the next song, loop back if at the end
    currentSong.src = `/${currfolder}/` + songs[currentIndex];
    currentSong.play();
    document.querySelector(".songInfo").innerHTML = decodeURIComponent(songs[currentIndex]); // Update song info
    console.log("Playing next song:", songs[currentIndex]);
});

document.getElementById('previous').addEventListener('click', () => {
    if (!songs || songs.length === 0) {
        console.error("No songs loaded.");
        return;
    }
    currentIndex = (currentIndex - 1 + songs.length) % songs.length; // Move to the previous song, loop back if at the start
    currentSong.src = `/${currfolder}/` + songs[currentIndex];
    currentSong.play();
    document.querySelector(".songInfo").innerHTML = decodeURIComponent(songs[currentIndex]); // Update song info
    console.log("Playing previous song:", songs[currentIndex]);
});


// Assuming you already have a songs array and an audio element
let currentIndex = 0; // Keeps track of the current song index

const audio = document.getElementById('audio'); // Replace with your audio element ID

// Event listener for the 'Next' button
document.getElementById('next').addEventListener('click', () => {
    console.log("Next clicked");
    currentIndex = (currentIndex + 1) % songs.length; // Move to the next song, loop back if at the end
    audio.src = songs[currentIndex]; // Update the audio source
    audio.play(); // Play the new song
    console.log(songs[currentIndex]); // Log the currently playing song
});

// Event listener for the 'Prev' button
document.getElementById('previous').addEventListener('click', () => {
    console.log("Previous clicked");
    currentIndex = (currentIndex - 1 + songs.length) % songs.length; // Move to the previous song, loop back if at the start
    audio.src = songs[currentIndex]; // Update the audio source
    audio.play(); // Play the new song
    console.log(songs[currentIndex]); // Log the currently playing song
});


// add event to volume

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log(e,e.target,e.target.value);
    currentSong.volume = parseInt(e.target.value)/100
})


// load the playlist by clickinh o card -->>


// Array.from(document.getElementsByClassName("card")).forEach(e=>{
//     e.addEventListener("click",async item=>{
//         songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
//     })
// })


// add eventlistener to vol-->>

document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes( "volume.svg")){
        e.target.src = e.target.src.replace("volume.svg","mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }else{
        e.target.src = e.target.src.replace("mute.svg","volume.svg")
        currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }
})


}
 

main();
 

