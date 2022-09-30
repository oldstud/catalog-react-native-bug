// highlight-import
import * as MediaLibrary from "expo-media-library";
// highlight-import
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { Configuration, VESDK } from "react-native-videoeditorsdk";

export const saveVideoCameraRollExample = async (): Promise<void> => {
  try {
    // Add a video from the assets directory.
    const video = require("../../../../assets/vesdk/Skater.mp4");

    // Since this example is using `expo-file-system` to remove the exported video later,
    // we need to export the video in one of the two directories that are supported by this module.
    // For further reference, please have a look at the official documentation here:
    // https://docs.expo.dev/versions/latest/sdk/filesystem/#directories
    // highlight-configuration
    const configuration: Configuration = {
      export: {
        filename:
          FileSystem.cacheDirectory +
          `export${Platform.OS == "android" ? ".mp4" : ""}`,
      },
    };
    // highlight-configuration

    // Open the video editor and handle the export as well as any occuring errors.
    // highlight-result
    const result = await VESDK.openEditor(video, configuration);
    // highlight-result

    if (result != null) {
      // The user exported a new video successfully and the newly generated video is located at `result.video`.
      // If **no modifications** have been made to the original video, we will not process the original video at all
      // and also not reencode it. In this case `result.video` will point to the original video that was passed to the editor,
      // if available. If you want to ensure that the original video is always reencoded, even if no modifications have
      // been made to it, you can set `configuration.export.force` to `true`, in which case `result.video` will
      // always point to a newly generated video.
      //
      // For this example, the video is saved into the camera roll of the device.
      // First, request the permissions for the camera roll.
      // highlight-camera-roll
      await MediaLibrary.requestPermissionsAsync();
      // highlight-camera-roll
      // Then, save the image to the library.
      // highlight-camera-roll
      await MediaLibrary.saveToLibraryAsync(result.video);
      // highlight-camera-roll

      // Delete the temporary export file only after the saving process has finished,
      // to be able to access it again in case anything went wrong while uploading
      // the video.
      // highlight-delete
      return FileSystem.deleteAsync(result.video);
      // highlight-delete
    } else {
      // The user tapped on the cancel button within the editor.
      return;
    }
  } catch (error) {
    // There was an error generating the video.
    console.log(error);
  }
};
