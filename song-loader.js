async function getsongs() {
    try {
        let response = await fetch('song-data.json');
        let jsonData = await response.json();

        let songs = jsonData.map(song => ({
            url: song.url,
            title: song.title,
            Authorname: song.Authorname,
            Imageurl: song.Imageurl
        }));
        return songs;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

//Removing Previous tab in tablist
async function RemoveTabsInTablist() {
    let tabs = document.querySelectorAll('[id^="newTab"]')
    tabs.forEach(e => {
        e.remove()
    })
}

// Creating Song list
async function createnewtab(url, title, Authorname, imgurl, dura) {
    var orgsongTab = document.getElementById('songtab');
    var clonedTab = orgsongTab.cloneNode(true);
    var newId = 'newTab_' + Date.now();
    clonedTab.id = newId;
    clonedTab.querySelector('h3').innerHTML = title
    clonedTab.querySelector('h6').innerHTML = Authorname
    clonedTab.querySelector('img').src = imgurl
    clonedTab.querySelector('.song-url').innerHTML = url
    // clonedTab.querySelector('a').innerHTML = dura
    clonedTab.style.display = 'flex'

    document.body.querySelector(".tablist").append(clonedTab);
}

async function createnewtab2(title, url) {
    var orgsongTab = document.getElementById('songtab');
    var clonedTab = orgsongTab.cloneNode(true);
    var newId = 'newTab_' + Date.now();
    clonedTab.id = newId;

    clonedTab.querySelector('h3').innerHTML = title
    clonedTab.querySelector('.song-url').innerHTML = url
    clonedTab.querySelector('img').src = "Song-icon.jpg"
    clonedTab.style.display = 'flex'

    document.body.querySelector(".tablist").append(clonedTab);
    return clonedTab
}

// Function to get the duration of an audio file
function getAudioDuration(url) {
    return new Promise((resolve, reject) => {
        var audio = new Audio(url);
        audio.addEventListener('loadedmetadata', function () {
            resolve(audio.duration);
        });
        audio.addEventListener('error', function (err) {
            reject(err);
        });
        audio.load();
    });
}


// Function to format time in HH:MM:SS format 
function formatTime(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Pad with zeros and create the HH:MM:SS format
    return (
        (hours > 0 ? hours + ':' : '') +
        (minutes < 10 ? '0' : '') + minutes + ':' +
        (remainingSeconds < 10 ? '0' : '') + remainingSeconds
    );
}

async function getmusic(path) {
    let a = await fetch(`${path}`);
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href);
        }
    }
    return songs;
}

async function getPlaylistimg(path) {
    let i = await fetch(`${path}`)
    let response = await i.text();
    let div = document.createElement('div')
    div.innerHTML = response
    let is = div.getElementsByTagName('a')
    let img = []

    for (let index = 0; index < is.length; index++) {
        const element = is[index];
        if (element.href.endsWith('.png') || element.href.endsWith('.jpg')) {
            img.push(element.href)
        }
    }
    return img
}

async function GetBgColor(filePath) {
    try {
        const response = await fetch(`${filePath}/Color.txt`);

        if (!response.ok) {
            throw new Error(`Failed to fetch the file. Status: ${response.status}`);
        }

        const text = await response.text();
        // console.log('Contents of Color.txt:', text);
        const colors = text.split(',');
        // console.log('Colors:', colors);

        return text

    } catch (error) {
        console.error(`Error fetching the file: ${error.message}`);
    }
}

async function DefaultCreatePlaylist(path) {
    let folderPath = path;
    if (folderPath.startsWith('http://')) {
        let formateTab = document.querySelector('.song-tab');
        var cloneSongTab = formateTab.cloneNode(true);
        let songList = document.querySelector('.songs-list');
        let lastSongTab = songList.lastElementChild;
        var newId = 'newPlaylistTab_' + Date.now();
        cloneSongTab.id = newId;
        let songs = await getmusic(folderPath);
        let img = await getPlaylistimg(folderPath)
        let playlistTitle = folderPath.split('/').filter(Boolean).pop();
        let song_titles = [];

        for (let index = 0; index < songs.length; index++) {
            const href = songs[index];
            song_titles.push(decodeURIComponent(href.split('/').pop().replace('.mp3', '')));
        }

        if (songs.length > 0) {
            let p_titles = []
            for (let index = 0; index < 4; index++) {
                const element = song_titles[index];
                p_titles.push(element)
            }
            let playlist_song_titles = p_titles.join(' | ')
            let BgCol = await GetBgColor(folderPath)
            cloneSongTab.querySelector('img').src = img[0]
            cloneSongTab.querySelector('h3').innerHTML = playlistTitle
            cloneSongTab.querySelector('p').innerHTML = playlist_song_titles
            cloneSongTab.querySelector('h6').innerHTML = BgCol
            cloneSongTab.querySelector('h5').innerHTML = path
            cloneSongTab.style.display = 'flex'
            songList.insertBefore(cloneSongTab, lastSongTab);

        } else {
            console.error('Songs not found');
        }


    } else {
        alert('Path is not valid!')
    }

}

async function LoadPlaylistFolders() {
    let a = await fetch('Songs')
    let response = await a.text()
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let folders = [];

    for (let index = 1; index < as.length; index++) {
        const element = as[index];
        folders.push(element.href)
    }

    for (let index = 0; index < folders.length; index++) {
        const element = folders[index];
        DefaultCreatePlaylist(element)
    }
}


async function main() {
    // Getting List Of All The Songs
    let songs = await getsongs()

    // Iterate through songs | Creating Tabs and get the duration for each
    for (let index = 0; index < songs.length; index++) {
        const element = songs[index];

        try {
            // Get the duration of the audio file
            const durationInSeconds = await getAudioDuration(element.url);

            // Convert seconds to a human-readable format
            const formattedDuration = formatTime(durationInSeconds);

            // Use the duration as needed (for example, pass it to createnewtab)
            await createnewtab(element.url, element.title, element.Authorname, element.Imageurl, formattedDuration);
        } catch (error) {
            console.error('Error getting audio duration:', error);
        }
    }

    // Play The Song
    let songtabs = document.querySelectorAll('.tab');
    let currentlyPlayingAudio = null;
    let currentlyPlayingAudioTabId = null;
    let playbtn = document.querySelector('#Play')
    let pausebtn = document.querySelector('#Pause')
    let bar = document.querySelector('.dura-bar')
    let currentbar = document.querySelector('.currentdura')


    // Stops currently playing audio
    function StopCurrentAudio() {
        currentlyPlayingAudio.pause();
        playbtn.style.display = 'none'
        pausebtn.style.display = 'block'
        currentlyPlayingAudio.currentTime = 0; // Reset playback position
    }

    function ChangeSongImage(tab) {
        let title = document.querySelector('.songinfo').querySelector('h3')
        let author = document.querySelector('.songinfo').querySelector('h6')
        let img = document.querySelector('.songinfo').querySelector('img')

        let tab_title = tab.querySelector('h3').innerHTML
        let tab_author = tab.querySelector('h6').innerHTML
        let tab_img = tab.querySelector('img').src

        title.innerHTML = tab_title
        author.innerHTML = tab_author
        img.src = tab_img
    }

    // Plays a song
    async function PlayTheSong(songurl) {

        let SongVolumeInput = document.querySelector('#volume').getElementsByTagName('input')[0];
        let SongVolume = SongVolumeInput.value;

        // Stop the currently playing audio, if any
        if (currentlyPlayingAudio) {
            StopCurrentAudio()
        }
        //Create New Audio from clicked tab
        var audio = new Audio(songurl);
        audio.play();

        // Update the reference to the currently playing audio
        currentlyPlayingAudio = await audio;

        currentlyPlayingAudio.volume = (SongVolume / 100)

        playbtn.style.display = 'none'
        pausebtn.style.display = 'block'

        audio.addEventListener('timeupdate', function () {
            // Get the current playback position
            const currentDurationInSeconds = audio.currentTime;
            const totalDurationInSeconds = audio.duration;

            // Convert seconds to a human-readable format
            const formattedCurrentDuration = formatTime(currentDurationInSeconds);
            const formattedtotalDuration = formatTime(totalDurationInSeconds)
            document.querySelector('.duration').innerHTML = `${formattedCurrentDuration} / ${formattedtotalDuration}`

            // duration bar setting
            let bar_dura = (currentDurationInSeconds / totalDurationInSeconds) * 100;

            currentbar.style.width = `${bar_dura}%`

            if (currentDurationInSeconds == totalDurationInSeconds) {
                pausebtn.style.display = 'none'
                playbtn.style.display = 'block'
            }

            // moving seekbar
            bar.addEventListener('click', (e) => {
                let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
                currentbar.style.width = (`${percent}%`)

                currentlyPlayingAudio.currentTime = ((currentlyPlayingAudio.duration * percent) / 100)
            })

        });
    }

    songtabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            let songurl = tab.querySelector('.song-url').innerHTML
            if (songurl) {
                PlayTheSong(songurl)

                ChangeSongImage(tab)

                currentlyPlayingAudioTabId = tab.id
            } else {
                console.error('can not get the song url');
            }
        })
    })


    //next and previous song function
    async function NextSong() {
        try {
            let NextTab = document.querySelector(`#${currentlyPlayingAudioTabId}`).nextElementSibling
            let NextSongUrl = NextTab.querySelector('.song-url').innerHTML
            currentlyPlayingAudioTabId = await NextTab.id

            if (NextSongUrl || NextTab) {
                StopCurrentAudio()
                PlayTheSong(NextSongUrl)
                ChangeSongImage(NextTab)
            }
            else {
                console.error('Song Not Found')
            }
        } catch (error) {
            console.log('Song Not Found | Error!');
        }

    }
    async function PrevSong() {
        try {
            let PrevTab = document.querySelector(`#${currentlyPlayingAudioTabId}`).previousElementSibling
            let PrevSongUrl = PrevTab.querySelector('.song-url').innerHTML

            currentlyPlayingAudioTabId = await PrevTab.id

            if (PrevSongUrl) {
                StopCurrentAudio()
                PlayTheSong(PrevSongUrl)
                ChangeSongImage(PrevTab)
            } else {
                console.error('Song Not Found')
            }
        } catch (error) {
            console.log('Song Not Found | Error!');
        }
    }

    document.querySelector('#Previous').addEventListener('click', () => {
        PrevSong()
    })
    document.querySelector('#Next').addEventListener('click', () => {
        NextSong()
    })


    // play/pause btn
    playbtn.addEventListener('click', () => {
        playbtn.style.display = 'none'
        pausebtn.style.display = 'block'
        currentlyPlayingAudio.play()
    })
    pausebtn.addEventListener('click', () => {
        pausebtn.style.display = 'none'
        playbtn.style.display = 'block'
        currentlyPlayingAudio.pause()
    })

    document.querySelector('.volume').getElementsByTagName('input')[0].addEventListener('change', (e) => {
        currentlyPlayingAudio.volume = parseInt(e.target.value) / 100
    })

    // Playlist

    async function PlaylistSongPlayer(SongUrl, id) {
        let tab = document.querySelector(`#${id}`)
        PlayTheSong(SongUrl)
        currentlyPlayingAudioTabId = await id
        ChangeSongImage(tab)
        currentlyPlayingAudio.addEventListener('ended', () => {
            let NextSongUrl = document.querySelector(`#${currentlyPlayingAudioTabId}`).nextElementSibling.querySelector('.song-url').innerHTML
            let NextSongTabid = document.querySelector(`#${currentlyPlayingAudioTabId}`).nextElementSibling.id
            PlaylistSongPlayer(NextSongUrl, NextSongTabid)
        })
    }

    async function AddClickEventToTab(tab) {
        tab.addEventListener('click', () => {
            let songurl = tab.querySelector('.song-url').innerHTML
            if (songurl) {
                PlayTheSong(songurl)

                ChangeSongImage(tab)

                currentlyPlayingAudioTabId = tab.id

            } else {
                console.error('can not get the song url');
            }
        })
    }

    await LoadPlaylistFolders()

    let Addbtn = document.querySelector('.AddSongBtn');

    Addbtn.addEventListener('click', () => {
        let url = prompt('Enter Path Url:')
        DefaultCreatePlaylist(url)
    });

    setTimeout(() => {
        let Playlist_tabs = document.querySelectorAll('.song-tab');
        let Right_panel = document.querySelector('.right_panel')

        Playlist_tabs.forEach(e => {
            e.addEventListener('mouseover', () => {
                Right_panel.style.background = `${e.querySelector('h6').innerHTML}`;
            });

            e.querySelector('.icon').addEventListener('click', async () => {
                await RemoveTabsInTablist()
                let path = e.querySelector('h5').innerHTML
                let songs = await getmusic(path)

                for (let index = 0; index < songs.length; index++) {
                    const e = songs[index];
                    let title = decodeURIComponent(e.split('/').pop().replace('.mp3', ''));
                    let tab = await createnewtab2(title, e);
                    AddClickEventToTab(tab);
                }

                let FirstSongUrl = document.querySelector('#songtab').nextElementSibling.querySelector('.song-url').innerHTML
                let FirstSongTabId = document.querySelector('#songtab').nextElementSibling.id
                PlaylistSongPlayer(FirstSongUrl, FirstSongTabId)
            })
        });

    }, 1000);
}

main();
