<?php
    $mysqli = new mysqli("localhost", "root", "", "StrategyOnline");


    // USERS

    function get_user_by_nick($nick)
    {
        global $mysqli;
        $result = $mysqli -> query("SELECT * FROM `users` WHERE `nick` = '$nick'");
        if ($result->num_rows == 0)
        {
            return null;
        }
        else
        {
            return $result->fetch_assoc();
        }
    }

    function register_new_user($nick, $password)
    {
        global $mysqli;
        $pass = md5($password);
        $result = $mysqli -> query("INSERT INTO `users` (`id`, `nick`, `password`) VALUES (NULL, '$nick', '$pass')");
        return $mysqli->insert_id;
    }

    function login_user($nick, $password)
    {
        global $mysqli;
        $pass = md5($password);
        $user = get_user_by_nick($nick);
        if ($pass === $user["password"])
        {
            return true;
        }
        return false;
    }

    function get_user_id($nick)
    {
        global $mysqli;
        $result = $mysqli -> query("SELECT * FROM `users` WHERE `nick` = '$nick'");
        if ($result->num_rows == 0)
        {
            return 0;
        }
        else
        {
            return $result->fetch_assoc()["id"];
        }
    }

    function get_user_nick($id)
    {
        global $mysqli;
        $result = $mysqli -> query("SELECT * FROM `users` WHERE `id` = '$id'");
        if ($result->num_rows == 0)
        {
            return 0;
        }
        else
        {
            return $result->fetch_assoc()["nick"];
        }
    }


    function is_user_logged_in()
    {
        if (isset($_COOKIE["u_n"]) && md5($_COOKIE["u_n"]) == $_COOKIE["u_n_h"])
            return true;
        return false;
    }

    function check_is_user_logged_in()
    {
        if (isset($_COOKIE["u_n"]) && md5($_COOKIE["u_n"]) == $_COOKIE["u_n_h"])
            return;
        header('Location: /login.php');
    }


    // GAMES

    function create_settings($field_size, $money_start, $soldier_cost, $mine_cost, $spawn_jewel, $jewels_max, $jewels_spawn_chance)
    {
        return [
            "field_size" => $field_size,
            "money_start" => $money_start,
            "soldier_cost" => $soldier_cost,
            "mine_cost" => $mine_cost,
            "spawn_jewel" => $spawn_jewel,
            "jewels_max" => $jewels_max,
            "jewels_spawn_chance" => $jewels_spawn_chance
        ];
    }

    function get_game($id)
    {
        global $mysqli;
        $result = $mysqli -> query("SELECT * FROM `games` WHERE `id` = '$id'");
        if ($result->num_rows == 0)
        {
            return null;
        }
        else
        {
            return $result->fetch_assoc();
        }
    }

    function get_all_available_games()
    {
        global $mysqli;
        $result = $mysqli -> query("SELECT * FROM `games` WHERE `started` = 0 AND `done` = 0");
        $arr = [];
        while($row = $result->fetch_assoc())
        {
            $arr[] = $row;
        }
        return $arr;
    }

    function create_game($owner_id, $settings)
    {
        global $mysqli;
        $players = json_encode([$owner_id]);
        $settings_json = json_encode($settings);
        $result = $mysqli -> query("INSERT INTO `games` (`id`, `owner_id`, `players`, `settings`, `started`, `done`) VALUES (NULL, '$owner_id', '$players', '$settings_json', 0, 0)");
        return $mysqli->insert_id;
    }

    function join_game($game_id, $user_id)
    {
        if($user_id == 0)
            return false;
        $game = get_game($game_id);
        if (in_array($user_id, json_decode($game["players"])))
        {
            return false;
        }
        global $mysqli;
        $players = json_decode($game["players"]);
        $players[] = $user_id;
        $players_json = json_encode($players);
        $result = $mysqli -> query("UPDATE `games` SET `players` = '$players_json' WHERE `id` = '$game_id'");
        if ($result == 1)
        {
            return true;
        }
    }

    function leave_game($game_id, $user_id)
    {
        if($user_id == 0)
            return false;
        $game = get_game($game_id);
        if (!in_array($user_id, json_decode($game["players"])))
        {
            return false;
        }
        global $mysqli;
        $players = json_decode($game["players"]);
        $players_tmp = array_diff($players, [$user_id]);
        $players = [];
        foreach ($players_tmp as $p) {
            $players[] = $p;
        }
        $players_json = json_encode($players);
        $result = $mysqli -> query("UPDATE `games` SET `players` = '$players_json' WHERE `id` = '$game_id'");
        if ($game["owner_id"] == $user_id)
        {
            $result2 = $mysqli -> query("UPDATE `games` SET `done` = 1 WHERE `id` = '$game_id'");
            if ($result2 != 1)
            {
                return false;
            }
        }
        if ($result == 1)
        {
            return true;
        }
    }

    function is_user_in_game($user_id)
    {
        if($user_id == 0)
            return false;
        global $mysqli;
        $result = $mysqli -> query("SELECT * FROM `games` WHERE `started` = 0 AND `done` = 0");
        while($row = $result->fetch_assoc())
        {
            if (in_array($user_id, json_decode($row["players"])))
            {
                return $row["id"];
            }
        }
        return false;
    }

?>