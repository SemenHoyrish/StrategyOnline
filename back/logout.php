<?php
    include_once "show_errors.php";
    include_once "db.php";

    if(!is_user_logged_in())
    {
        header('Location: /');
        return;
    }

    setcookie("u_n", "", -1, "/");
    setcookie("u_n_h", "", -1, "/");
    header('Location: /');

?>