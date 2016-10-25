var setSong = function(songNumber) {
    //console.log("setSong:songNumber", songNumber);
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
   // console.log("currentlyPlayingSongNumber is " + currentlyPlayingSongNumber + " and currentSongFromAlbum is ", currentSongFromAlbum);
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        preload: true
    });
    
    setVolume(currentVolume);
};

var seek = function(time) {
    
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
    
};

var setVolume = function(volume){
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
    
};

var createSongRow = function(songNumber, songName, songLength) {
    var template = 
        '<tr class="album-view-song-item">'
    +   '   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    +   '   <td class="song-item-title">' + songName + '</td>'
    +   '   <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
    +   '</tr>';
    
    var $row = $(template);
    
    //click eventHandler
    
    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
            
            //console.log("currentlyPlayingSongNumber = " + currentlyPlayingSongNumber + " First conditional");
                
        }
        
        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            //currentlyPlayingSongNumber = songNumber;
            //currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            $(this).html(pauseButtonTemplate);
            updatePlayerBarSong();
           // console.log("currentlyPlayingSongNumber = " + currentlyPlayingSongNumber + " Second conditional");
          
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
            
            
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currenntly playing song.
           // $(this).html(playButtonTemplate);
            //$('.main-controls .play-pause').html(playerBarPlayButton);
            
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
            }
            //currentlyPlayingSongNumber = null;
            //currentSongFromAlbum = null;
            
           // console.log("currentlyPlayingSongNumber = " + currentlyPlayingSongNumber + " Third conditional");
            
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

var filterTimeCode = function(timeInSeconds) {
    var secondsInNumForm = parseFloat(timeInSeconds);
    var mathFloor = Math.floor(secondsInNumForm);
    var timer = buzz.toTimer(mathFloor);
    return timer;
    //console.log(buzz.toTimer(mathFloor));
};

var setTotalTimeinPlayerBar = function(totalTime) {
    var $currentSongDurationLocation = $('.seek-control .total-time');
   //var $currentSongDuration = totalTime;
    
    $currentSongDurationLocation.text(totalTime);
    //console.log(totalTime);
};

var setCurrentTimeInPlayerBar = function(currentTime) {
    var $currentTimeLocation = $('.seek-control .current-time');
    //console.log(currentTime);
    
    $currentTimeLocation.text(currentTime);
};

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
           // setCurrentTimeInPlayerBar(this.getTime());
            setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
            
            // Above will change to setCurrentTimeInPlayerBar(filterTimeCode(this.getTime());
            // Other function needs wrapped argument too
            // filterTimeCode will convert to minutes and seconds and 'return' those values
        }); 
        
    }
    
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
    
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function(event) {
        
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        
        if ($(this).parent().attr('class' == 'seek-control')) {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        
        updateSeekPercentage($(this), seekBarFillRatio);
        
    });
    
    $seekBars.find('.thumb').mousedown(function(event) {
       
        var $seekBar = $(this).parent();
        
        $(document).bind('mousemove.thumb', function(event) {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            
            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio * 100);
            }
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
            
        });
        
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
    
};

var trackIndex = function(album, song){
    return album.songs.indexOf(song);
};

var nextSong = function() {
    var getLastSongNumber = function(index) {
      return index == 0 ? currentAlbum.songs.length : index;  
    };
    
   // console.log("nextSong:currentlyPlayingSongNumber", currentlyPlayingSongNumber);
  //  console.log("nextSong:song", currentSongFromAlbum);
    
    var currentSongIndex = trackIndex(currentAlbum,  currentSongFromAlbum);
   // console.log("nextSong:currentSongIndex:beforeIncrement", currentSongIndex);
    
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
    
   // console.log("nextSong:currentSongIndex:afterIncrement", currentSongIndex);
    
   // console.log("nextSong:currentAlbum.songs.length", currentAlbum.songs.length);
    if (currentSongIndex >= currentAlbum.songs.length) {
        console.log("nextSong:currentSongIndex >= currentAlbum.songs.length", true);
        currentSongIndex = 0;
    }
    
    //Set a new current song
    //currentlyPlayingSongNumber = currentSongIndex + 1;
    //currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
   // console.log("nextSong:currentlyPlayingSongNumber:beforeSetSong", currentlyPlayingSongNumber);
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
  //  console.log("nextSong:currentlyPlayingSongNumber:afterSetSong", currentlyPlayingSongNumber);
    updatePlayerBarSong();
    
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
    
   // console.log("previousSong:currentlyPlayingSongNumber", currentlyPlayingSongNumber);
   // console.log("previousSong:song", currentSongFromAlbum);
    
    var currentSongIndex = trackIndex(currentAlbum,  currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
   // console.log("previousSong:currentSongIndex:beforeIncrement", currentSongIndex);
    currentSongIndex--;
    
   // console.log("previousSong:currentSongIndex:afterIncrement", currentSongIndex);
    
   // console.log("previous:currentAlbum.songs.length", currentAlbum.songs.length);
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length -1;
       
    }
    
    //Set a new current song
    //currentlyPlayingSongNumber = currentSongIndex + 1;
    //currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
   // console.log("previousSong:currentlyPlayingSongNumber:beforeSetSong", currentlyPlayingSongNumber);
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
  //  console.log("previousSong:currentlyPlayingSongNumber:afterSetSong", currentlyPlayingSongNumber);
    updatePlayerBarSong();
    
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
    setTotalTimeinPlayerBar(filterTimeCode(currentSongFromAlbum.duration));

};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';


var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

//on load function section

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    
});