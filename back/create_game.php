<?php
    if (isset($_POST["done"]))
    {
        include_once "show_errors.php";
        include_once "db.php";

        check_is_user_logged_in();
        $res = create_game(get_user_id($_COOKIE["u_n"]), create_settings(
            (int)$_POST["field_size"],
            (int)$_POST["money_start"],
            (int)$_POST["soldier_cost"],
            (int)$_POST["mine_cost"],
            isset($_POST["spawn_jewel"]) ? 1 : 0,
            (int)$_POST["jewels_max"],
            (int)$_POST["jewels_spawn_chance"]
        ));

        if ($res == 0)
        {
            echo "error!";
        }
        else
        {
            echo "OK!";
        }
    }
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create game</title>
</head>
<body>
    <form action="" method="post">
        <input type="text" name="field_size" placeholder="field_size" />
        <input type="text" name="money_start" placeholder="money_start" />
        <input type="text" name="soldier_cost" placeholder="soldier_cost" />
        <input type="text" name="mine_cost" placeholder="mine_cost" />
        <label >spawn_jewel: 
            <input type="checkbox" name="spawn_jewel" />
        </label>
        <input type="text" name="jewels_max" placeholder="jewels_max" />
        <input type="text" name="jewels_spawn_chance" placeholder="jewels_spawn_chance" />
        <input type="submit" name="done" value="create" />
    </form>
</body>
</html>