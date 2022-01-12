const player = (name, number) => {
    this.name = name;
    this.symbol = number === 1 ? 'x' : 'o';
    const getSymbol = () => this.symbol;
    return {name, getSymbol}
}

const game = (doc, player1, player2)=>{
    const x = true;
    const o = false;
    const CUSTOM_ATTRIBUTES = {
        index: 'data-index',
        marked: 'data-marked',
    }
    // first player to go is o
    let currentTurn = o;
    const WIDTH = 700;
    const cells = [];
    const wrapper = doc.querySelector('div.game');

    // create cells
    (()=>{
        for(let i = 0; i < 9; i++){
            cells[i] = null;
        }
    })();

    const render = () => {
        for(let i = 0; i < 9; i++){
            let square = doc.createElement('div');
            square.classList.add('square');
            square.setAttribute(CUSTOM_ATTRIBUTES.index, i);
            square.style.width = `${WIDTH/3}px`;  
            square.style.height = `${WIDTH/3}px`;
            square.addEventListener('click', mark);
            wrapper.appendChild(square);
        }
    };

    /**
     * 0 game is ongoing
     * 1 player 1 wins
     * 2 player 2 wins
     * 3 game is a tie
     * @returns 0, 1, 2, or 3
     */
    const checkWin = () => {
        const checkCells = [1,3,4,5,7];
        for (let i of checkCells){
            if (cells[i] !== null){
                // check rows
                if (i === 1 || i === 4 || i === 7){
                    if (cells[i-1] === cells[i] && cells[i+1] === cells[i]){
                        return cells[i] ? 2 : 1;
                    }
                }
                // check columns
                if (i === 3 || i === 4 || i === 5){
                    if (cells[i-3] === cells[i] && cells[i+3] === cells[i]){
                        return cells[i] ? 2 : 1;
                    }
                }
                // check center
                if(i === 4){ 
                    if (cells[i-2] === cells[i] && cells[i+2] === cells[i]){
                        return cells[i] ? 2 : 1;
                    }
                    else if(cells[i-4] === cells[i] && cells[i+4] === cells[i]){
                        return cells[i] ? 2 : 1;
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

    const mark = (e) => {
        if (!e.target.getAttribute(CUSTOM_ATTRIBUTES.marked)){
            let index = e.target.getAttribute(CUSTOM_ATTRIBUTES.index);
            e.target.setAttribute(CUSTOM_ATTRIBUTES.marked, true);
            if (currentTurn === x){
                e.target.textContent = 'x';
                cells[index] = x;
            } else {   
                e.target.textContent = 'o';
                cells[index] = o;
            }
            currentTurn = !currentTurn;
            switch (checkWin()){
                case 1:
                    console.log(player1.name, 'wins');
                    break;
                case 2:
                    console.log(player2.name, 'wins');
                    break;
                case 3:
                    console.log('game is a tie');
                    break;
            } 
        }
    };

    const toggleShow = () => {
        // checking if its empty string first because the value is not the value initally set in css for some reason
        wrapper.style.display = wrapper.style.display === '' ? 'grid' : wrapper.style.display === 'none' ? 'grid' : 'none';
        render();
    };

    return {
        toggleShow
    }
};

const start = ((doc)=>{
    const form = doc.querySelector('.form-wrapper');
    const btnStart = form.querySelector('.btn');
    const inputP1 = form.querySelector('#p1');
    const inputP2 = form.querySelector('#p2');
    
    const startGame = () => {
        const p1 = inputP1.value || 'Player 1';
        const p2 = inputP2.value || 'Player 2';
        const g = game(doc, player(p1, 1), player(p2, 2));
        toggleShow();
        g.toggleShow();
    };

    const toggleShow = () => {
        form.style.display = form.style.display === 'none' ? 'grid' : 'none';
    };

    //bind events
    (()=>{
        btnStart.addEventListener('click', startGame);
    })()
    return {toggleShow};
})(document);