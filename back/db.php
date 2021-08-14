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
        $insert_id = $mysqli->insert_id;
        set_default_game_data($insert_id);
        return $insert_id;
    }

    function get_game_data($game_id, $key)
    {
        global $mysqli;
        $game = get_game($game_id);
        if ($game === null)
            return null;
        // if ($game["done"] == 1)
        //     return null;
        
        $result = $mysqli -> query("SELECT * FROM `games_data` WHERE `game_id` = '$game_id' AND `data_key` = '$key'");
        if ($result->num_rows == 0)
        {
            return null;
        }
        else
        {
            return $result->fetch_assoc()["data_value"];
        }
    }

    function set_game_data($game_id, $key, $value)
    {
        global $mysqli;
        $game = get_game($game_id);
        if ($game === null)
            return null;
        // if ($game["done"] == 1)
        //     return null;

        if (get_game_data($game_id, $key) === null)
        {
            $result = $mysqli -> query("INSERT INTO `games_data` (`id`, `game_id`, `data_key`, `data_value`) VALUES (NULL, '$game_id', '$key', '$value')");
            if ($mysqli->insert_id != 0)
            {
                return true;
            }
            return false;
        }
        else
        {
            $result = $mysqli -> query("UPDATE `games_data` SET `data_value` = '$value' WHERE `game_id` = '$game_id' AND `data_key` = '$key'");
            if ($result == 1)
            {
                return true;
            }
            return false;
        }
    }
    
    function set_default_game_data($game_id)
    {
        if ($game_id == 0)
            return false;

        $key = "step";
        $value = 0;
        set_game_data($game_id, $key, $value);

        // FIRST player
        $key = "firstPlayerStep";
        $value = 0;
        set_game_data($game_id, $key, $value);
        $key = "firstPlayerColor";
        $value = json_encode("blue");
        set_game_data($game_id, $key, $value);
        $key = "firstPlayerBasePos";
        $value = 0;
        set_game_data($game_id, $key, $value);
        $key = "firstPlayerBasePosX";
        $value = 1;
        set_game_data($game_id, $key, $value);
        $key = "firstPlayerBasePosY";
        $value = 1;
        set_game_data($game_id, $key, $value);
        $key = "firstPlayerMines";
        $value = json_encode([]);
        set_game_data($game_id, $key, $value);
        $key = "firstPlayerSoldiers";
        $value = json_encode([]);
        set_game_data($game_id, $key, $value);

        // second player
        $key = "secondPlayerStep";
        $value = 0;
        set_game_data($game_id, $key, $value);
        $key = "secondPlayerColor";
        $value = json_encode("yellow");
        set_game_data($game_id, $key, $value);
        $key = "secondPlayerBasePos";
        $value = 9;
        set_game_data($game_id, $key, $value);
        $key = "secondPlayerBasePosX";
        $value = 10;
        set_game_data($game_id, $key, $value);
        $key = "secondPlayerBasePosY";
        $value = 1;
        set_game_data($game_id, $key, $value);
        $key = "secondPlayerMines";
        $value = json_encode([]);
        set_game_data($game_id, $key, $value);
        $key = "secondPlayerSoldiers";
        $value = json_encode([]);
        set_game_data($game_id, $key, $value);

        // third player
        $key = "thirdPlayerStep";
        $value = 0;
        set_game_data($game_id, $key, $value);
        $key = "thirdPlayerColor";
        $value = json_encode("magenta");
        set_game_data($game_id, $key, $value);
        $key = "thirdPlayerBasePos";
        $value = 90;
        set_game_data($game_id, $key, $value);
        $key = "thirdPlayerBasePosX";
        $value = 1;
        set_game_data($game_id, $key, $value);
        $key = "thirdPlayerBasePosY";
        $value = 10;
        set_game_data($game_id, $key, $value);
        $key = "thirdPlayerMines";
        $value = json_encode([]);
        set_game_data($game_id, $key, $value);
        $key = "thirdPlayerSoldiers";
        $value = json_encode([]);
        set_game_data($game_id, $key, $value);

        // fourth player
        $key = "fourthPlayerStep";
        $value = 0;
        set_game_data($game_id, $key, $value);
        $key = "fourthPlayerColor";
        $value = json_encode("red");
        set_game_data($game_id, $key, $value);
        $key = "fourthPlayerBasePos";
        $value = 99;
        set_game_data($game_id, $key, $value);
        $key = "fourthPlayerBasePosX";
        $value = 10;
        set_game_data($game_id, $key, $value);
        $key = "fourthPlayerBasePosY";
        $value = 10;
        set_game_data($game_id, $key, $value);
        $key = "fourthPlayerMines";
        $value = json_encode([]);
        set_game_data($game_id, $key, $value);
        $key = "fourthPlayerSoldiers";
        $value = json_encode([]);
        set_game_data($game_id, $key, $value);

        return true;
    }

    function get_all_game_data($game_id)
    {
        if ($game_id == 0)
            return json_encode(false);

        $data = [];

        $key = "step";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;

        // FIRST player
        $key = "firstPlayerStep";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "firstPlayerColor";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "firstPlayerBasePos";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "firstPlayerBasePosX";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "firstPlayerBasePosY";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "firstPlayerMines";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "firstPlayerSoldiers";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;

        // second player
        $key = "secondPlayerStep";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "secondPlayerColor";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "secondPlayerBasePos";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "secondPlayerBasePosX";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "secondPlayerBasePosY";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "secondPlayerMines";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "secondPlayerSoldiers";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;

        // third player
        $key = "thirdPlayerStep";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "thirdPlayerColor";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "thirdPlayerBasePos";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "thirdPlayerBasePosX";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "thirdPlayerBasePosY";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "thirdPlayerMines";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "thirdPlayerSoldiers";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;

        // fourth player
        $key = "fourthPlayerStep";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "fourthPlayerColor";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "fourthPlayerBasePos";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "fourthPlayerBasePosX";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "fourthPlayerBasePosY";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "fourthPlayerMines";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;
        $key = "fourthPlayerSoldiers";
        $value = get_game_data($game_id, $key);
        $data[$key] = $value;

        return json_encode($data);
    }

    function get_players($game_id)
    {
        global $mysqli;
        $result = $mysqli -> query("SELECT * FROM `games` WHERE `id` = '$game_id'");
        if ($result->num_rows == 0)
        {
            return null;
        }
        else
        {
            return $result->fetch_assoc()["players"];
        }
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