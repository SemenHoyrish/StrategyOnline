<?php
    include_once "show_errors.php";
    include_once "db.php";

    check_is_user_logged_in();

    $game_id = $_GET["game_id"];

    $res = join_game($game_id, get_user_id($_COOKIE["u_n"]));

    if ($res === false)
    {
        echo "ERROR! <br/ > or maybe you already in game";
    }
    else
    {
        echo "YOU JOINED A GAME!";
    }

?>

<a href="/">to main page</a>
