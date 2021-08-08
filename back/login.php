<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
    include_once "./db.php";

    if (is_user_logged_in())
    {
        header('Location: /');
    }

    if (isset($_POST["done"]))
    {
        if (get_user_by_nick($_POST["nick"]) === null)
        {
            echo "NO SUCH USER REGISTERED!";
            return;
        }

        if (login_user($_POST["nick"], $_POST["password"]))
        {
            setcookie("u_n", $_POST["nick"], time() + (86400), "/"); // 1 day
            setcookie("u_n_h", md5($_POST["nick"]), time() + (86400), "/"); // 1 day
            header('Location: /');
        }
        else
        {
            echo "PASSWORD INCORRECT!";
        }
    }
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
    <form action="" method="post">
        <input type="text" name="nick" placeholder="nick">
        <input type="password" name="password" placeholder="password">
        <input type="submit" name="done" value="login" />
    </form>
</body>
</html>