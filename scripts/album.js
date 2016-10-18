var setSong = function(songNumber) {
    console.log("setSong:songNumber", songNumber);
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    console.log("currentlyPlayingSongNumber is " + currentlyPlayingSongNumber + " and currentSongFromAlbum is ", currentSongFromAlbum);
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
    
};

var createSongRow = function(songNumber, songName, songLength) {
    var template = 
        '<tr class="album-view-song-item">'
    +   '   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    +   '   <td class="song-item-title">' + songName + '</td>'
    +   '   <td class="song-item-duration">' + songLength + '</td>'
    +   '</tr>';
    
    var $row = $(template);
    
    //click eventHandler
    
    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingCell);
            
            console.log("currentlyPlayingSongNumber = " + currentlyPlayingSongNumber + " First conditional");
                
        }
        
        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            //currentlyPlayingSongNumber = songNumber;
            //currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            setSong(songNumber);
            updatePlayerBarSong();
            
            console.log("currentlyPlayingSongNumber = " + currentlyPlayingSongNumber + " Second conditional");
            
            
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currenntly playing song.
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
            //setSong(songNumber) = null;
            
            console.log("currentlyPlayingSongNumber = " + currentlyPlayingSongNumber + " Third conditional");
            
        }

    };
    
    //onHover event handler
    
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    
    //offHover event handler
    
    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
        
        //console.log("songNumber type is " + typeof songNumber + "\n and setSong(songNumber) type is " + typeof setSong(songNumber));
    };
    
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
    
};
    
var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty();
    
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song){
    return album.songs.indexOf(song);
};

var nextSong = function() {
    var getLastSongNumber = function(index) {
      return index == 0 ? currentAlbum.songs.length : index;  
    };
    
    console.log("nextSong:currentlyPlayingSongNumber", currentlyPlayingSongNumber);
    console.log("nextSong:song", currentSongFromAlbum);
    
    var currentSongIndex = trackIndex(currentAlbum,  currentSongFromAlbum);
    console.log("nextSong:currentSongIndex:beforeIncrement", currentSongIndex);
    
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
    
    console.log("nextSong:currentSongIndex:afterIncrement", currentSongIndex);
    
    console.log("nextSong:currentAlbum.songs.length", currentAlbum.songs.length);
    if (currentSongIndex >= currentAlbum.songs.length) {
        console.log("nextSong:currentSongIndex >= currentAlbum.songs.length", true);
        currentSongIndex = 0;
    }
    
    //Set a new current song
    //currentlyPlayingSongNumber = currentSongIndex + 1;
    //currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    console.log("nextSong:currentlyPlayingSongNumber:beforeSetSong", currentlyPlayingSongNumber);
    setSong(currentSongIndex + 1);
    console.log("nextSong:currentlyPlayingSongNumber:afterSetSong", currentlyPlayingSongNumber);
    
    //Update the player bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber +'"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    
    // Note the difference between this implementation and the one in 
    // nextSong()
    var getLastSongNumber = function(index) {
      return index == (currentAlbum.songs.length -1) ? 1 : index +2;  
    };
    
    console.log("previousSong:currentlyPlayingSongNumber", currentlyPlayingSongNumber);
    console.log("previousSong:song", currentSongFromAlbum);
    
    var currentSongIndex = trackIndex(currentAlbum,  currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    console.log("previousSong:currentSongIndex:beforeIncrement", currentSongIndex);
    currentSongIndex--;
    
    console.log("previousSong:currentSongIndex:afterIncrement", currentSongIndex);
    
    console.log("previous:currentAlbum.songs.length", currentAlbum.songs.length);
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length -1;
       
    }
    
    //Set a new current song
    //currentlyPlayingSongNumber = currentSongIndex + 1;
    //currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    console.log("previousSong:currentlyPlayingSongNumber:beforeSetSong", currentlyPlayingSongNumber);
    setSong(currentSongIndex + 1);
    console.log("previousSong:currentlyPlayingSongNumber:afterSetSong", currentlyPlayingSongNumber);
    
    //Update the player bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber +'"]');
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);

};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';


var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

//on load function section

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    
});