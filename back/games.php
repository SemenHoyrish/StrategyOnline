<?php
    include_once "show_errors.php";
    include_once "db.php";

    check_is_user_logged_in();

    $games = get_all_available_games();

    $is_user_in_game = is_user_in_game(get_user_id ($_COOKIE["u_n"]));
    if ($is_user_in_game !== false)
    {
        ?>
        <div class="leave-game">
        <h1>You are in game!</h1>
        <a href="./leave.php?game_id=<?php echo $is_user_in_game ?>">leave</a>
        </div>
        <?php
    }
    ?>
    <style>
    .leave-game h1 {
        margin-bottom: 0;
    }
    .leave-game a {
        font-size: 20px;
    }
    .cards {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
        .card {
            background-color: lightblue;
            width: 200px;
            padding: 5px 15px;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .player {
            margin: 4px;
        }
        .card a {
            margin: 20px;
        }
    </style>
        <div class="cards">

    <?php
    foreach ($games as $game) { ?>
        
        <div class="card">
            <h2 class="owner"><?php echo get_user_nick($game["owner_id"]) ?></h2>
            <?php foreach (json_decode($game["players"]) as $player) { ?>
                <h3 class="player"><?php echo get_user_nick($player) ?></h3>
            <?php } ?>
            <a href="./join.php?game_id=<?php echo $game['id'] ?>">join</a>
        </div>
    <?php }
    ?>
        </div>
<?php
?>