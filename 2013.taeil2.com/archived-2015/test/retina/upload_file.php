<?php


$allowedExts = array("gif", "jpeg", "jpg", "png");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);

// check file types
if ((($_FILES["file"]["type"] == "image/gif")
|| ($_FILES["file"]["type"] == "image/jpeg")
|| ($_FILES["file"]["type"] == "image/jpg")
|| ($_FILES["file"]["type"] == "image/pjpeg")
|| ($_FILES["file"]["type"] == "image/x-png")
|| ($_FILES["file"]["type"] == "image/png"))
&& ($_FILES["file"]["size"] < 1000000) // if we want to limit the file size
&& in_array($extension, $allowedExts)) {
  if ($_FILES["file"]["error"] > 0) {
    echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
  } else {
    echo "Upload: " . $_FILES["file"]["name"] . "<br>";
    echo "Type: " . $_FILES["file"]["type"] . "<br>";
    echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
    echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br>";
    if (file_exists($_FILES["file"]["name"])) {
      echo $_FILES["file"]["name"] . " already exists. ";
    } else {
      
        $images = $_FILES["file"]["tmp_name"];
        $new_images = $_FILES["file"]["name"];
        //copy($_FILES, "photos/".$_FILES["file"]["name"]);
        $size=GetimageSize($images);

        $width=round($size[0]/2);
        $height=round($size[1]/2);

        switch ($extension) {
            case 'jpg':
                $images_orig = imagecreatefromjpeg($images);
                break;
            case 'jpeg':
                $images_orig = imagecreatefromjpeg($images);
                break;
            case 'png':
                $images_orig = imagecreatefrompng($images);
                break;
            case 'gif':
                $images_orig = imagecreatefromgif($images);
                break;
            default:
                $images_orig = imagecreatefromjpeg($images);
        }

        $photoX = ImagesX($images_orig);
        $photoY = ImagesY($images_orig);
        $images_fin = ImageCreateTrueColor($width, $height);

        // preserve transparency
        switch ($extension)
        {
            case "png":
                $background = imagecolorallocate($images_fin, 0, 0, 0);
                imagecolortransparent($images_fin, $background);
                imagealphablending($images_fin, false);
                imagesavealpha($images_fin, true);
                break;
            case "gif":
                imagealphablending($images_fin, false);
                // get and reallocate transparency-color
                $transindex = imagecolortransparent($images_orig);
                if($transindex >= 0) {
                  $transcol = imagecolorsforindex($images_orig, $transindex);
                  $transindex = imagecolorallocatealpha($images_fin, $transcol['red'], $transcol['green'], $transcol['blue'], 127);
                  imagefill($images_fin, 0, 0, $transindex);
                }

                break;
        }

        ImageCopyResampled($images_fin, $images_orig, 0, 0, 0, 0, $width, $height, $photoX, $photoY);

        switch ($extension) {
            case 'jpg':
                ImageJPEG($images_fin, $new_images);
                break;
            case 'jpeg':
                ImageJPEG($images_fin, $new_images);
                break;
            case 'png':
                ImagePNG($images_fin, $new_images);
                break;
            case 'gif':
                // restore transparency
                if($transindex >= 0) {
                    imagecolortransparent($images_fin, $transindex);
                    for ($y = 0; $y < $height; ++$y) {
                        for ($x = 0; $x < $width; ++$x) {
                            if (((imagecolorat($images_fin, $x, $y) >> 24) & 0x7F) >= 100) {
                                imagesetpixel(
                                    $images_fin,
                                    $x,
                                    $y,
                                    $transindex
                                );
                            }
                        }
                    }
                }

                // save GIF
                imagetruecolortopalette($images_fin, true, 255);
                imagesavealpha($images_fin, false);

                ImageGIF($images_fin, $new_images);
                break;
            default:
                ImageJPEG($images_fin, $new_images);
        }
        
        ImageDestroy($images_orig);
        ImageDestroy($images_fin);

        move_uploaded_file($_FILES["file"]["tmp_name"], pathinfo($_FILES['file']['name'], PATHINFO_FILENAME)."@2x.".$extension);
      echo "Stored in: " . pathinfo($_FILES['file']['name'], PATHINFO_FILENAME)."@2x.".$extension."<br>";
      echo "<a href=http://www.taeil2.com/test/retina/".pathinfo($_FILES['file']['name'], PATHINFO_FILENAME).".".$extension.">".pathinfo($_FILES['file']['name'], PATHINFO_FILENAME).".".$extension."</a><br>";
      echo "<a href=http://www.taeil2.com/test/retina/".pathinfo($_FILES['file']['name'], PATHINFO_FILENAME)."@2x.".$extension.">".pathinfo($_FILES['file']['name'], PATHINFO_FILENAME)."@2x.".$extension."</a>";
    }
  }
} else {
  echo "Invalid file";
}

?>
