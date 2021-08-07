const field = document.querySelector(".field");

const FIELD_SIZE = 10;

const color = "undefined";

const basePosition = 90;
const basePositionX = 1;
const basePositionY = 10;


// Opponents

// first
const firstOpponentColor = "undefined";
const firstOpponentBasePosition = 0;
const firstOpponentBasePositionX = 0;
const firstOpponentBasePositionY = 0;
let firstOpponentSoldiers = [];
let firstOpponentMines = [];

// second
const secondOpponentColor = "undefined";
const secondOpponentBasePosition = 0;
const secondOpponentBasePositionX = 0;
const secondOpponentBasePositionY = 0;
let secondOpponentSoldiers = [];
let secondOpponentMines = [];

// third
const thirdOpponentColor = "undefined";
const thirdOpponentBasePosition = 0;
const thirdOpponentBasePositionX = 0;
const thirdOpponentBasePositionY = 0;
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
    let block = clickedBlock;
    if (IsBlockEmpty(block) && SeeBlock(clickedBlockIndex)) {
        block.classList.add("mine");
        mines.push(block);
    } else {
        alert("Block are not empty!");
    }
    HideCreateMenu();
}

const CreateSoldier = (block=clickedBlock) => {
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
    if (GetBlockX(clickedBlockIndex) != 1 && IsBlockEmpty(blocks[clickedBlockIndex - 1])) {
        RemoveSoldier(clickedBlock);
        CreateSoldier(blocks[clickedBlockIndex - 1]);
    } else {
        alert("Block are not empty!");
    }
    HideSoldierControl();
} 

const SoldierUp = () => {
    if (GetBlockY(clickedBlockIndex) != 1 && IsBlockEmpty(blocks[clickedBlockIndex - 10])) {
        RemoveSoldier(clickedBlock);
        CreateSoldier(blocks[clickedBlockIndex - 10]);
    } else {
        alert("Block are not empty!");
    }
    HideSoldierControl();
}

const SoldierDown = () => {
    if (GetBlockY(clickedBlockIndex) != 10 && IsBlockEmpty(blocks[clickedBlockIndex + 10])) {
        RemoveSoldier(clickedBlock);
        CreateSoldier(blocks[clickedBlockIndex + 10]);
    } else {
        alert("Block are not empty!");
    }
    HideSoldierControl();
}

const SoldierRight = () => {
    if (GetBlockX(clickedBlockIndex) != 10 && IsBlockEmpty(blocks[clickedBlockIndex + 1])) {
        RemoveSoldier(clickedBlock);
        CreateSoldier(blocks[clickedBlockIndex + 1]);
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


const Main = () => {
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

Main();
