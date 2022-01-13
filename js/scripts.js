const Player = (name, symbol, isAI = false) => {
    return {name, symbol, isAI}
};


const Modal = (doc, query) => {
    const modal = doc.querySelector(query);
    const show = () => {
        modal.style.display = 'block';
    };
    const hide = () => {
        modal.style.display = 'none';
    };
    return {modal, show, hide};
};

const game = (doc, player1, player2, isSinglePlayerMode = false)=>{
    console.log('game started in single player mode: ', isSinglePlayerMode)
    const CUSTOM_ATTRIBUTES = {
        index: 'data-index',
        marked: 'data-marked',
    }
    // first turn
    let currentTurn = player1;
    const WIDTH = 700;
    const cells = [];
    const wrapper = doc.querySelector('div.game');
    // game over modal
    const modal = Modal(doc, '.modal');
    modal.playAgain = () => {
        resetGame();
        modal.hide();
    };
    modal.btn = modal.modal.querySelector('button');
    modal.text = modal.modal.querySelector('p');
    modal.btn.addEventListener('click', modal.playAgain);

    resetGame();

    function switchTurns(){
        currentTurn = currentTurn === player1 ? player2 : player1;     
        console.log('current turn is: ',currentTurn.name)   
    }

    function render(){
        while(wrapper.hasChildNodes()){
            wrapper.removeChild(wrapper.firstChild);
        }
        for(let i = 0; i < 9; i++){
            let square = doc.createElement('div');
            square.classList.add('square', 'text-primary');
            square.setAttribute(CUSTOM_ATTRIBUTES.index, i);
            square.style.width = `${WIDTH/3}px`;  
            square.style.height = `${WIDTH/3}px`;
            if (cells[i] !== null){
                square.setAttribute(CUSTOM_ATTRIBUTES.marked, true)
                square.textContent = cells[i];
            } else {
                square.addEventListener('click', mark);
            }
            wrapper.appendChild(square);
        }
    };

    function resetGame(){
        for(let i = 0; i < 9; i++){
            cells[i] = null;
        }
        currentTurn = player1;
        render();
    };

    /**
     * 0 = game is ongoing, 1 = player 1 wins, 2 = player 2 wins, 3 = game is a tie
     * @returns 0, 1, 2, or 3
     */
    function checkWin(){
        const checkCells = [1,3,4,5,7];
        for (let i of checkCells){
            if (cells[i] !== null){
                // check rows
                if (i === 1 || i === 4 || i === 7){
                    if (cells[i-1] === cells[i] && cells[i+1] === cells[i]){
                        return cells[i] === player1.symbol ? 1 : 2;
                    }
                }
                // check columns
                if (i === 3 || i === 4 || i === 5){
                    if (cells[i-3] === cells[i] && cells[i+3] === cells[i]){
                        return cells[i] === player1.symbol ? 1 : 2;
                    }
                }
                // check diagonals
                if(i === 4){ 
                    if (cells[i-2] === cells[i] && cells[i+2] === cells[i]){
                        return cells[i] === player1.symbol ? 1 : 2;
                    }
                    else if(cells[i-4] === cells[i] && cells[i+4] === cells[i]){
                        return cells[i] === player1.symbol ? 1 : 2;
                    }
                }
            }
        }
        // if all cells are filled and no winner
        if (!cells.includes(null)){
            return 3;
        }
        return 0;
    };

    /**
     * Event Listener for when a game cell is clicked
     * @param e event 
     */
    function mark(e){
        if (!currentTurn.isAI && !e.target.getAttribute(CUSTOM_ATTRIBUTES.marked)){
            const index = e.target.getAttribute(CUSTOM_ATTRIBUTES.index)
            cells[index] = currentTurn.symbol;
            gameOver(checkWin());
            switchTurns();
            if (currentTurn.isAI && cells.includes(null)){
                aiTurn();
                gameOver(checkWin());
            }
            render();
            // handling whether the game is actually over or not is
            // delegated to gameOver()
        }
    };

    function aiTurn(){
        while (currentTurn === player2){
            let randomIndex = Math.floor(Math.random() * 8);
            if (cells[randomIndex] === null){
                cells[randomIndex] = currentTurn.symbol;
                switchTurns();
            }
        }
    }

    /**
     * Handles the result of checkWin
     * @param result return result of checkWin 0,1,2, or 3 
     * @returns 
     */
    function gameOver(result){
        switch (result) {
            case 0:
                return;
            case 1:
                modal.text.textContent = `${player1.name} Wins!`;
                break;
            case 2:
                modal.text.textContent = `${player2.name} Wins!`;
                break;
            case 3:
                modal.text.textContent = `Tie!`;
                break;
        } 
        modal.show();
    };

    function toggleShow(){
        // checking if its empty string first because the value is not the value initally set in css for some reason
        wrapper.style.display = wrapper.style.display === '' ? 'grid' : wrapper.style.display === 'none' ? 'grid' : 'none';
        render();
    };

    return {
        toggleShow
    }
};

const start = ((doc)=>{
    const isSinglePlayerMode = true;
    // game mode modal
    const modalGameMode = Modal(doc, '#modal-game-mode');
    const btnSinglePlayer = modalGameMode.modal.querySelector('#single');
    const btnMultiPlayer = modalGameMode.modal.querySelector('#multi');
    modalGameMode.singlePlayerMode = () => {
        modalGameMode.hide();
        startGame(isSinglePlayerMode);
    };
    modalGameMode.multiPlayerMode = () => {
        modalGameMode.hide();
        startGame(!isSinglePlayerMode);
    };
    btnSinglePlayer.addEventListener('click', modalGameMode.singlePlayerMode);
    btnMultiPlayer.addEventListener('click', modalGameMode.multiPlayerMode);
    // form modal
    const modalForm = Modal(doc, '#modal-form');
    const btnStartGame = modalForm.modal.querySelector('.btn');
    const inputP1 = modalForm.modal.querySelector('#p1');
    const inputP2 = modalForm.modal.querySelector('#p2');
    modalForm.startMultiFlow = () => {
        const p1 = inputP1.value || 'Player 1';
        const p2 = inputP2.value || 'Player 2';
        modalForm.hide();
        initGame(Player(p1, 'O'), Player(p2, 'X'));
    }
    btnStartGame.addEventListener('click', modalForm.startMultiFlow);
    
    startFlow();

    function startFlow(){
        modalGameMode.show();
    }

    function initGame(player1, player2, gameMode = false){
        const g = game(doc, player1, player2, gameMode);
        g.toggleShow();
    }

    function startGame(gameMode){
        if (gameMode === isSinglePlayerMode){
            initGame(Player('Player 1', 'O'), Player('AI', 'X', true), gameMode);
        } else {
            modalForm.show();
        }
    };
})(document);