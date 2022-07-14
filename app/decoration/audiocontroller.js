//Play  audio

export const play = async (playbackObject, uri) => {
  try {
    return await playbackObject.loadAsync({ uri }, { shouldPlay: true });
  } catch (error) {
    console.log("error", error.message);
  }
};

//Pause audio

export const pause = async (playbackObject) => {
  try {
    return await playbackObject.setStatusAsync({
      shouldPlay: false,
    });
  } catch (error) {
    console.log("error here", error.message);
  }
};

//Resume audio

export const resume = async (playbackObject) => {
  try {
    return await playbackObject.playAsync();
  } catch (error) {
    console.log("error here", error.message);
  }
};

//select another audio for play
export const playNext = async (playbackObject, uri) => {
  try {
    await playbackObject.stopAsync();
    await playbackObject.unloadAsync();
    return await play(playbackObject, uri);
  } catch (error) {
    console.log("error here", error.message);
  }
};
