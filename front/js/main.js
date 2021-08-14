const field = document.querySelector(".field");

let FIELD_SIZE = 10;

let players = [];
let user_id = 0;
let game_id = 0;

let color = "undefined";

let basePosition = 90;
let basePositionX = 1;
let basePositionY = 10;


// Opponents

// first
let firstOpponentColor = "undefined";
let firstOpponentBasePosition = 0;
let firstOpponentBasePositionX = 0;
let firstOpponentBasePositionY = 0;
let firstOpponentSoldiers = [];
let firstOpponentMines = [];

// second
let secondOpponentColor = "undefined";
let secondOpponentBasePosition = 0;
let secondOpponentBasePositionX = 0;
let secondOpponentBasePositionY = 0;
let secondOpponentSoldiers = [];
let secondOpponentMines = [];

// third
let thirdOpponentColor = "undefined";
let thirdOpponentBasePosition = 0;
let thirdOpponentBasePositionX = 0;
let thirdOpponentBasePositionY = 0;
let thirdOpponentSoldiers = [];
let thirdOpponentMines = [];



let visibilityX = 2;
let visibilityY = 2;

let visibleArea = [];

let blocks = [];

let mines = [];
let soldiers = [];

let clickedBlock = null;
let clickedBlockIndex = 0;

let activeSolderBlock = null;
let activeSolderBlockIndex = 0;

const createMenu = document.querySelector(".create-menu");
const soldierControl = document.querySelector(".soldier-control");
const killMenu = document.querySelector(".kill-menu");

const maxActionsLabel = document.querySelector(".max-actions");

let maxActions = 3;
let didActions = 0;


const Create = () => {
    for (let i = 0; i < FIELD_SIZE * FIELD_SIZE; i++) {
        let block = document.createElement("div");
        block.classList.add("block");
        field.appendChild(block);
        blocks.push(block);
        if (i==basePosition)
        {
            block.classList.add("base");
        }
    }
    
}


const GetBlockX = (blockIndex) => {
    if (blockIndex < 10) {
        return blockIndex + 1;
    }
    return +blockIndex.toString()[1] + 1;
}

const GetBlockY = (blockIndex) => {
    if (blockIndex < 10) {
        return 1;
    }
    return +blockIndex.toString()[0] + 1;
}

const GetBlockByPosition = (x, y) => {
    blocks.forEach(block => {
        // console.log(block);
        let index = blocks.indexOf(block);
        // console.log(index);

        // console.log(GetBlockX(index), " ", x);
        // console.log(GetBlockY(index), " ", y);
        if (GetBlockX(index) == x &&
            GetBlockY(index) == y) {
                // console.log("yes");
                // console.log(block);
                return block;
            }
            else {
                return null;
            }
    });
}

const GetBlockIndexByPosition = (x, y) => {
    blocks.forEach(block => {
        // console.log(block);
        let index = blocks.indexOf(block);
        // console.log(index);

        // console.log(GetBlockX(index), " ", x);
        // console.log(GetBlockY(index), " ", y);
        if (GetBlockX(index) == x &&
            GetBlockY(index) == y) {
                // console.log("yes");
                // console.log(block);
                return index;
            }
            else {
                return null;
            }
    });
}

const DeleteItemFromArray = (array, value) => {
    for( var i = 0; i < array.length; i++){ 
        if ( array[i] === value) { 
            array.splice(i, 1);
            return;
        }
    }
}

const CheckVisibleArea = () => {

    visibleArea = [];
    
    // visibleArea.push(blocks[basePosition]);

    blocks.forEach(block => {
        let blockIndex = blocks.indexOf(block);
        if (Math.abs(basePositionX - GetBlockX(blockIndex)) <= visibilityX && 
        Math.abs(basePositionY - GetBlockY(blockIndex)) <= visibilityY ) {
            visibleArea.push(block);
        }
    });

    soldiers.forEach(soldier => {
        let soldierIndex = blocks.indexOf(soldier);
        blocks.forEach(block => {
            let blockIndex = blocks.indexOf(block);
            if (Math.abs(GetBlockX(soldierIndex) - GetBlockX(blockIndex)) <= 1 && 
            Math.abs(GetBlockY(soldierIndex) - GetBlockY(blockIndex)) <= 1 &&
            !visibleArea.includes(block)) {
                visibleArea.push(block);
            }
        });
    });

    blocks.forEach(block => {
        block.classList.remove("visible");
    });

    visibleArea.forEach(block => {
        block.classList.add("visible");
    });


    CheckVisibleOpponents();

}

const CheckVisibleOpponents = () => {
    firstOpponentMines.forEach(mine => {
        mine.classList.remove("opponentMine");
        mine.classList.remove(firstOpponentColor);
        if (SeeBlock(mine)) {
            mine.classList.add("opponentMine");
            mine.classList.add(firstOpponentColor);
        }
    });
    firstOpponentSoldiers.forEach(soldier => {
        soldier.classList.remove("opponentSoldier");
        soldier.classList.remove(firstOpponentColor);
        if (SeeBlock(soldier)) {
            soldier.classList.add("opponentSoldier");
            soldier.classList.add(firstOpponentColor);
        }
    });

    secondOpponentMines.forEach(mine => {
        mine.classList.remove("opponentMine");
        mine.classList.remove(secondOpponentColor);
        if (SeeBlock(mine)) {
            mine.classList.add("opponentMine");
            mine.classList.add(secondOpponentColor);
        }
    });
    secondOpponentSoldiers.forEach(soldier => {
        soldier.classList.remove("opponentSoldier");
        soldier.classList.remove(secondOpponentColor);
        if (SeeBlock(soldier)) {
            soldier.classList.add("opponentSoldier");
            soldier.classList.add(secondOpponentColor);
        }
    });

    firstOpponentMines.forEach(mine => {
        mine.classList.remove("opponentMine");
        mine.classList.remove(firstOpponentColor);
        if (SeeBlock(mine)) {
            mine.classList.add("opponentMine");
            mine.classList.add(firstOpponentColor);
        }
    });
    firstOpponentSoldiers.forEach(soldier => {
        soldier.classList.remove("opponentSoldier");
        soldier.classList.remove(firstOpponentColor);
        if (SeeBlock(soldier)) {
            soldier.classList.add("opponentSoldier");
            soldier.classList.add(firstOpponentColor);
        }
    });
}

const SeeBlock = (blockIndex) => {
    // if (Math.abs(basePositionX - GetBlockX(blockIndex)) <= visibilityX && 
    //     Math.abs(basePositionY - GetBlockY(blockIndex)) <= visibilityY ) {
    //         return true;
    //     }
    if (visibleArea.includes(blocks[blockIndex])) {
        return true;
    }
    return false;
}

const IsBase = (blockIndex) => {
    if (GetBlockX(blockIndex) == basePositionX
        && GetBlockY(blockIndex) == basePositionY) {
            return true;
    }

    return false;
}

const CanDoStep = () => {
    if (didActions < maxActions) {
        didActions++;
        return true;
    } else {
        maxActionsLabel.classList.add("active");
        return false;
    }
}

const ShowCreateMenu = () => {
    createMenu.classList.add("active");
}

const HideCreateMenu = () => {
    createMenu.classList.remove("active");
}

const ShowSoldierControl = () => {
    soldierControl.classList.add("active");
}

const HideSoldierControl = () => {
    soldierControl.classList.remove("active");
}

const IsBlockEmpty = (block) => {
    // console.log(block);
    if (!block.classList.contains("mine")
        && !block.classList.contains("soldier")) {
            return true;
    }
    return false;
}

const IsBlockSoldier = (block) => {
    if (block.classList.contains("soldier")) {
        return true;
    }
    return false;
}

const CreateMine = () => {
    if (!CanDoStep()) return;
    let block = clickedBlock;
    if (IsBlockEmpty(block) && SeeBlock(clickedBlockIndex)) {
        block.classList.add("mine");
        mines.push(block);
    } else {
        alert("Block are not empty!");
    }
    HideCreateMenu();
}

const CreateSoldier = (byPlayer=true, block=clickedBlock) => {
    if (byPlayer && !CanDoStep()) return;
    if (IsBlockEmpty(block) && SeeBlock(clickedBlockIndex)) {
        block.classList.add("soldier");
        soldiers.push(block);
    } else {
        alert("Block are not empty!");
    }
    HideCreateMenu();
    CheckVisibleArea();
}

const RemoveSoldier = (block=clickedBlock) => {
    if (IsBlockSoldier(block)) {
        block.classList.remove("soldier");

        for( var i = 0; i < soldiers.length; i++){ 
            if ( soldiers[i] === block) { 
                soldiers.splice(i, 1);
                return;
            }
        }
    
    } else {
        alert("Block are not soldier!");
    }
}

createMenu.querySelector(".create-mine").addEventListener("click", () => {
    CreateMine();
});
createMenu.querySelector(".create-soldier").addEventListener("click", () => {
    CreateSoldier();
});


// const SoldierLeft = () => {
//     console.log(GetBlockByPosition(
//         GetBlockX(clickedBlockIndex) - 1,
//         GetBlockY(clickedBlockIndex)
//         ))

//     console.log(clickedBlockIndex);
//     console.log(GetBlockX(clickedBlockIndex));
//     console.log(GetBlockX(clickedBlockIndex) - 1);
//     console.log(GetBlockY(clickedBlockIndex));


//     if (IsBlockEmpty(
//             GetBlockByPosition(
//                             GetBlockX(clickedBlockIndex) - 1,
//                             GetBlockY(clickedBlockIndex)
//                             )
//                         )) {
//         RemoveSoldier(clickedBlock);
//         CreateSoldier(GetBlockByPosition(
//             GetBlockX(clickedBlockIndex) - 1,
//             GetBlockY(clickedBlockIndex)
//         ));
//     } else {
//         alert("Block are not empty!");
//     }
// } 

// const SoldierLeft = () => {
//     console.log(GetBlockByPosition(
//         GetBlockX(clickedBlockIndex) - 1,
//         GetBlockY(clickedBlockIndex)
//         ))

//     console.log(clickedBlockIndex);
//     console.log(GetBlockX(clickedBlockIndex));
//     console.log(GetBlockX(clickedBlockIndex) - 1);
//     console.log(GetBlockY(clickedBlockIndex));

//     console.log("!!", blocks[GetBlockIndexByPosition(
//         GetBlockX(clickedBlockIndex) - 1,
//         GetBlockY(clickedBlockIndex)
//         )]);

//         console.log("!!", blocks[81]);

//         console.log("!!!", GetBlockIndexByPosition(
//             GetBlockX(clickedBlockIndex) - 1,
//             GetBlockY(clickedBlockIndex)
//             ));

//     if (IsBlockEmpty(
//             blocks[GetBlockIndexByPosition(
//                 GetBlockX(clickedBlockIndex) - 1,
//                 GetBlockY(clickedBlockIndex)
//                 )]
//                         )) {
//         RemoveSoldier(clickedBlock);
//         CreateSoldier(blocks[GetBlockIndexByPosition(
//             GetBlockX(clickedBlockIndex) - 1,
//             GetBlockY(clickedBlockIndex)
//             )]);
//     } else {
//         alert("Block are not empty!");
//     }
// } 

const SoldierLeft = () => {
    if (!CanDoStep()) return;
    if (GetBlockX(clickedBlockIndex) != 1 && IsBlockEmpty(blocks[clickedBlockIndex - 1])) {
        RemoveSoldier(clickedBlock);
        CreateSoldier(false, blocks[clickedBlockIndex - 1]);
    } else {
        alert("Block are not empty!");
    }
    HideSoldierControl();
} 

const SoldierUp = () => {
    if (!CanDoStep()) return;
    if (GetBlockY(clickedBlockIndex) != 1 && IsBlockEmpty(blocks[clickedBlockIndex - 10])) {
        RemoveSoldier(clickedBlock);
        CreateSoldier(false, blocks[clickedBlockIndex - 10]);
    } else {
        alert("Block are not empty!");
    }
    HideSoldierControl();
}

const SoldierDown = () => {
    if (!CanDoStep()) return;
    if (GetBlockY(clickedBlockIndex) != 10 && IsBlockEmpty(blocks[clickedBlockIndex + 10])) {
        RemoveSoldier(clickedBlock);
        CreateSoldier(false, blocks[clickedBlockIndex + 10]);
    } else {
        alert("Block are not empty!");
    }
    HideSoldierControl();
}

const SoldierRight = () => {
    if (!CanDoStep()) return;
    if (GetBlockX(clickedBlockIndex) != 10 && IsBlockEmpty(blocks[clickedBlockIndex + 1])) {
        RemoveSoldier(clickedBlock);
        CreateSoldier(false, blocks[clickedBlockIndex + 1]);
    } else {
        alert("Block are not empty!");
    }
    HideSoldierControl();
} 


soldierControl.querySelector(".left").addEventListener("click", () => {
    SoldierLeft();
});

soldierControl.querySelector(".up").addEventListener("click", () => {
    SoldierUp();
});

soldierControl.querySelector(".down").addEventListener("click", () => {
    SoldierDown();
});

soldierControl.querySelector(".right").addEventListener("click", () => {
    SoldierRight();
});


const Kill = () => {
    if (!CanDoStep()) return;
    if (IsBlockSoldier(blocks[clickedBlockIndex - 1]) ||
    IsBlockSoldier(blocks[clickedBlockIndex + 1]) ||
    IsBlockSoldier(blocks[clickedBlockIndex - 10]) ||
    IsBlockSoldier(blocks[clickedBlockIndex + 10])) {
        if (clickedBlock.classList.contains("opponentMine")) {
            if (firstOpponentMines.includes(clickedBlock))
                DeleteItemFromArray(firstOpponentMines, clickedBlock);
            else if (secondOpponentMines.includes(clickedBlock))
                DeleteItemFromArray(secondOpponentMines, clickedBlock);
            else if (thirdOpponentMines.includes(clickedBlock))
                DeleteItemFromArray(thirdOpponentMines, clickedBlock);
        } else if (clickedBlock.classList.contains("opponentSoldier")) {
            if (firstOpponentSoldiers.includes(clickedBlock))
                DeleteItemFromArray(firstOpponentSoldiers, clickedBlock);
            else if (secondOpponentSoldiers.includes(clickedBlock))
                DeleteItemFromArray(secondOpponentSoldiers, clickedBlock);
            else if (thirdOpponentSoldiers.includes(clickedBlock))
                DeleteItemFromArray(thirdOpponentSoldiers, clickedBlock);
        }
    } else {
        alert("No soldier to kill it!");
    }
    
}


killMenu.querySelector(".kill").addEventListener("click", () => {
    Kill();
});

const ShowKillMenu = () => {
    killMenu.classList.add("active");
}

const HideKillMenu = () => {
    killMenu.classList.remove("active");
}


const IsOpponent = (block) => {
    if (block.classList.contains("opponentMine") || block.classList.contains("opponentSoldier")) {
        return true;
    }
    return false;
}

const AvailableAction = () => {
    HideCreateMenu();
    HideSoldierControl();
    if (IsBlockEmpty(clickedBlock))
        ShowCreateMenu();
    else if (IsBlockSoldier(clickedBlock) && !IsOpponent(clickedBlock))
        ShowSoldierControl();
    else if (IsOpponent(clickedBlock))
        ShowKillMenu();
}


const Init = () => {
    blocks.forEach(block => {
        let index = blocks.indexOf(block);
        if (SeeBlock(index))
        {
            block.classList.add("visible");
        }
        block.addEventListener("click", () => {
            clickedBlockIndex = index;
            clickedBlock = block;
            // alert("x: " + GetBlockX(index) + "  y: " + GetBlockY(index) + "  see?: " + SeeBlock(index));
            if (!IsBase(index) && SeeBlock(index)) {
                AvailableAction();
            }
        });
    });
    
    CheckVisibleArea();
}

let loaded = false;

const CheckDataLoaded = () => {
    console.log(loaded);
    if (loaded == true) {
        Create();
        Init();
    } else {
        setTimeout(() => {
            CheckDataLoaded();
        }, 200);
    }
}

const Main = () => {
    game_id = +location.href.split("#")[1];
    user_id = +location.href.split("#")[2];

    GetPlayers();
    Get();
   
    CheckDataLoaded();
}

const GetPlayers = () => {
    var xhr = new XMLHttpRequest();
	xhr.open("GET", `http://192.168.0.114/get_players.php?game_id=${game_id}`, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	xhr.onreadystatechange = function() {
	    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			console.log(xhr.response);

            let data = JSON.parse(xhr.response);

            if (data != false)
            {
                players = data;
            }
        }

	}
	xhr.send(null);
}

const Get = () => {
    var xhr = new XMLHttpRequest();
	xhr.open("GET", `http://192.168.0.114/get.php?game_id=${game_id}`, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	xhr.onreadystatechange = function() {
	    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			console.log(xhr.response);

            let data = JSON.parse(xhr.response);

            if (data != false)
            {
                FIELD_SIZE = 10;

                let main_counter = 0;
                let counter = 0;
                players.forEach(player => {
                    main_counter++;
                    if (player == user_id) {
                        console.log("you");
                        switch (main_counter) {
                            case 1:
                                console.log(1);
                                console.log(data);
                                color = JSON.parse(data["firstPlayerColor"]);
                                basePosition = +data["firstPlayerBasePos"];
                                basePositionX = +data["firstPlayerBasePosX"];
                                basePositionY = +JSON.parse(data["firstPlayerBasePosY"]);
                                mines = JSON.parse(data["firstPlayerMines"]);
                                soldiers = JSON.parse(data["firstPlayerSoldiers"]);
                                break;
                            case 2:
                                color = JSON.parse(data["secondPlayerColor"]);
                                basePosition = +data["secondPlayerBasePos"];
                                basePositionX = +data["secondPlayerBasePosX"];
                                basePositionY = +JSON.parse(data["secondPlayerBasePosY"]);
                                mines = JSON.parse(data["secondPlayerMines"]);
                                soldiers = JSON.parse(data["secondPlayerSoldiers"]);
                                break;
                            case 3:
                                color = JSON.parse(data["thirdPlayerColor"]);
                                basePosition = +data["thirdPlayerBasePos"];
                                basePositionX = +data["thirdPlayerBasePosX"];
                                basePositionY = +JSON.parse(data["thirdPlayerBasePosY"]);
                                mines = JSON.parse(data["thirdPlayerMines"]);
                                soldiers = JSON.parse(data["thirdPlayerSoldiers"]);
                                break;
                            case 4:
                                color = JSON.parse(data["fourthPlayerColor"]);
                                basePosition = +data["fourthPlayerBasePos"];
                                basePositionX = +data["fourthPlayerBasePosX"];
                                basePositionY = +JSON.parse(data["fourthPlayerBasePosY"]);
                                mines = JSON.parse(data["fourthPlayerMines"]);
                                soldiers = JSON.parse(data["fourthPlayerSoldiers"]);
                                break;
                            default:
                                break;
                        }
                    } else {
                        counter++;
                        switch (counter) {
                            case 1:
                                console.log("enemy 1");
                                switch (main_counter) {
                                    case 1:
                                        console.log(1);
                                        firstOpponentColor = JSON.parse(data["firstPlayerColor"]);
                                        firstOpponentBasePosition = +data["firstPlayerBasePos"];
                                        firstOpponentBasePositionX = +data["firstPlayerBasePosX"];
                                        firstOpponentBasePositionY = +JSON.parse(data["firstPlayerBasePosY"]);
                                        firstOpponentMines = JSON.parse(data["firstPlayerMines"]);
                                        firstOpponentSoldiers = JSON.parse(data["firstPlayerSoldiers"]);
                                        break;
                                    case 2:
                                        console.log(2);

                                        firstOpponentColor = JSON.parse(data["secondPlayerColor"]);
                                        firstOpponentBasePosition = +data["secondPlayerBasePos"];
                                        firstOpponentBasePositionX = +data["secondPlayerBasePosX"];
                                        firstOpponentBasePositionY = +JSON.parse(data["secondPlayerBasePosY"]);
                                        firstOpponentMines = JSON.parse(data["secondPlayerMines"]);
                                        firstOpponentSoldiers = JSON.parse(data["secondPlayerSoldiers"]);
                                        break;
                                    case 3:
                                        console.log(3);

                                        firstOpponentColor = JSON.parse(data["thirdPlayerColor"]);
                                        firstOpponentBasePosition = +data["thirdPlayerBasePos"];
                                        firstOpponentBasePositionX = +data["thirdPlayerBasePosX"];
                                        firstOpponentBasePositionY = +JSON.parse(data["thirdPlayerBasePosY"]);
                                        firstOpponentMines = JSON.parse(data["thirdPlayerMines"]);
                                        firstOpponentSoldiers = JSON.parse(data["thirdPlayerSoldiers"]);
                                        break;
                                    case 4:
                                        console.log(4);

                                        firstOpponentColor = JSON.parse(data["fourthPlayerColor"]);
                                        firstOpponentBasePosition = +data["fourthPlayerBasePos"];
                                        firstOpponentBasePositionX = +data["fourthPlayerBasePosX"];
                                        firstOpponentBasePositionY = +JSON.parse(data["fourthPlayerBasePosY"]);
                                        firstOpponentMines = JSON.parse(data["fourthPlayerMines"]);
                                        firstOpponentSoldiers = JSON.parse(data["fourthPlayerSoldiers"]);
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case 2:
                                switch (main_counter) {
                                    case 1:
                                        secondOpponentColor = JSON.parse(data["firstPlayerColor"]);
                                        secondOpponentBasePosition = +data["firstPlayerBasePos"];
                                        secondOpponentBasePositionX = +data["firstPlayerBasePosX"];
                                        secondOpponentBasePositionY = +data["firstPlayerBasePosY"];
                                        secondOpponentSoldiers = JSON.parse(data["firstPlayerMines"]);
                                        secondOpponentMines = JSON.parse(data["firstPlayerSoldiers"]);
                                        break;
                                    case 2:
                                        secondOpponentColor = JSON.parse(data["secondPlayerColor"]);
                                        secondOpponentBasePosition = +data["secondPlayerBasePos"];
                                        secondOpponentBasePositionX = +data["secondPlayerBasePosX"];
                                        secondOpponentBasePositionY = +data["secondPlayerBasePosY"];
                                        secondOpponentSoldiers = JSON.parse(data["secondPlayerMines"]);
                                        secondOpponentMines = JSON.parse(data["secondPlayerSoldiers"]);
                                        break;
                                    case 3:
                                        secondOpponentColor = JSON.parse(data["thirdPlayerColor"]);
                                        secondOpponentBasePosition = +data["thirdPlayerBasePos"];
                                        secondOpponentBasePositionX = +data["thirdPlayerBasePosX"];
                                        secondOpponentBasePositionY = +data["thirdPlayerBasePosY"];
                                        secondOpponentSoldiers = JSON.parse(data["thirdPlayerMines"]);
                                        secondOpponentMines = JSON.parse(data["thirdPlayerSoldiers"]);
                                        break;
                                    case 4:
                                        secondOpponentColor = JSON.parse(data["fourthPlayerColor"]);
                                        secondOpponentBasePosition = +data["fourthPlayerBasePos"];
                                        secondOpponentBasePositionX = +data["fourthPlayerBasePosX"];
                                        secondOpponentBasePositionY = +data["fourthPlayerBasePosY"];
                                        secondOpponentSoldiers = JSON.parse(data["fourthPlayerMines"]);
                                        secondOpponentMines = JSON.parse(data["fourthPlayerSoldiers"]);
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            case 3:
                                switch (main_counter) {
                                    case 1:
                                        thirdOpponentColor = JSON.parse(data["firstPlayerColor"]);
                                        thirdOpponentBasePosition = +data["firstPlayerBasePos"];
                                        thirdOpponentBasePositionX = +data["firstPlayerBasePosX"];
                                        thirdOpponentBasePositionY = +data["firstPlayerBasePosY"];
                                        thirdOpponentSoldiers = JSON.parse(data["firstPlayerMines"]);
                                        thirdOpponentMines = JSON.parse(data["firstPlayerSoldiers"]);
                                        break;
                                    case 2:
                                        thirdOpponentColor = JSON.parse(data["secondPlayerColor"]);
                                        thirdOpponentBasePosition = +data["secondPlayerBasePos"];
                                        thirdOpponentBasePositionX = +data["secondPlayerBasePosX"];
                                        thirdOpponentBasePositionY = +data["secondPlayerBasePosY"];
                                        thirdOpponentSoldiers = JSON.parse(data["secondPlayerMines"]);
                                        thirdOpponentMines = JSON.parse(data["secondPlayerSoldiers"]);
                                        break;
                                    case 3:
                                        thirdOpponentColor = JSON.parse(data["thirdPlayerColor"]);
                                        thirdOpponentBasePosition = +data["thirdPlayerBasePos"];
                                        thirdOpponentBasePositionX = +data["thirdPlayerBasePosX"];
                                        thirdOpponentBasePositionY = +data["thirdPlayerBasePosY"];
                                        thirdOpponentSoldiers = JSON.parse(data["thirdPlayerMines"]);
                                        thirdOpponentMines = JSON.parse(data["thirdPlayerSoldiers"]);
                                        break;
                                    case 4:
                                        thirdOpponentColor = JSON.parse(data["fourthPlayerColor"]);
                                        thirdOpponentBasePosition = +data["fourthPlayerBasePos"];
                                        thirdOpponentBasePositionX = +data["fourthPlayerBasePosX"];
                                        thirdOpponentBasePositionY = +data["fourthPlayerBasePosY"];
                                        thirdOpponentSoldiers = JSON.parse(data["fourthPlayerMines"]);
                                        thirdOpponentMines = JSON.parse(data["fourthPlayerSoldiers"]);
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
                
            }
            loaded = true;
        }

	}

	xhr.send(null);
}

const Send = () => {

}

Main();
