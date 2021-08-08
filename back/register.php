<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
    include_once "./db.php";

    if (isset($_POST["done"]))
    {
        if (get_user_by_nick($_POST["nick"]) !== null)
        {
            echo "USER ALREADY REGISTERED!";
            return;
        }
        if ($_POST["password"] != $_POST["re-password"])
        {
            echo "PASSWORDS ARE DIFFERENT!";
            return;
        }
        register_new_user($_POST["nick"], $_POST["password"]);
        echo "OK!";
    }
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
</head>
<body>
    <form action="" method="post">
        <input type="text" name="nick" placeholder="nick">
        <input type="password" name="password" placeholder="password">
        <input type="password" name="re-password" placeholder="re-password">
        <input type="submit" name="done" value="register" />
    </form>
</body>
</html>