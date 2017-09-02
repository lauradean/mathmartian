<?php
    $params = array();
    if (isset($_GET['p'])) {
        $params = split(',', $_GET['p']);
    }

    if (isset($params[0])) {
        $minnum1 = $params[0];
    } else {
        $minnum1 = 0;
    }

    if (isset($params[0])) {
        $maxnum1 = $params[1];
    } else {
        $maxnum1 = 7;
    }

    if (isset($params[0])) {
        $minnum2 = $params[2];
    } else {
        $minnum2 = 0;
    }

    if (isset($params[0])) {
        $maxnum2 = $params[3];
    } else {
        $maxnum2 = 7;
    }

    //exit;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title> Math Martian (in development) </title>
	<style type="text/css">
		body { background: #000000; margin: 0; padding: 0; }
		p { margin: 8px 32px; }
        #debug {
            position:absolute;
            left:10px;
            top:10px;
            width: 200px;
            color: white;
        }
		#legend {
			text-align: center;
			color: white;
		}
		#legend h1 { font: normal 1.4em sans-serif; }
		#legend a { color: white; font: normal 1.0em sans-serif; }
	</style>

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.js"></script>
<script src="http://www.google.com/jsapi"></script>
<script>

</script>

<body id='body' onkeydown="scaninput(event);">
<div id="data">

<pre id="debug"></pre>
</div>

<div id="legend">
<h1>*** == MATH MARTIAN == ***</h1>
Code based on <a href="http://rebelideas.co.uk:81/proto/empire/">Hoth Strike</a>,
Images from
<a href="http://s167.photobucket.com/albums/u149/CEREAL_KILLER74/?action=view&current=baby-alien-walking.gif">
CEREAL_KILLER74</a><p>
Press any key when the Martian walks under the saucer with the correct answer.
</div>
</body>
</html>
