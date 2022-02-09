const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.result')
const score = document.querySelector('.score')
const level = document.querySelector('.level')
const life = document.querySelector('.life')
let interval = 400
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let invadersRemoved = [];
let randomInvaders = []
let points = 0
let level1 = 1
let health = 2


for (let i = 0; i < 225; i++) {
    const square = document.createElement('div')

    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const invaders = [
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
]

randomizeInvaders()

function randomizeInvaders() {
    for (let i = 0; i < invaders.length; i++) {

        let randomNum = Math.floor(Math.random() * invaders.length)

        if (randomInvaders === [] && randomNum > 0 && randomNum < 69) {
            randomInvaders.push(randomNum)

        } else if (!randomInvaders.includes(randomNum) && randomNum > 0 && randomNum < 69) {
            randomInvaders.push(randomNum)
        }

    }

}

function construct() {
    for (let i = 0; i < randomInvaders.length; i++) {
        if (!invadersRemoved.includes(i)) {

            if (squares[randomInvaders[i]] != undefined) {
                squares[randomInvaders[i]].classList.add('invader', 'fab', 'fa-octopus-deploy')
            }

        }
    }
}

construct()

function remove() {
    for (let i = 0; i < randomInvaders.length; i++) {
        if (squares[randomInvaders[i]] != undefined) {
            squares[randomInvaders[i]].classList.remove('invader', 'invader', 'fab', 'fa-octopus-deploy')
        }
    }
}

squares[currentShooterIndex].classList.add('shooter', 'fas', 'fa-caret-up')


function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter', 'fas', 'fa-caret-up')
    switch (e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width != 0) {
                currentShooterIndex -= 1
            }
            break

        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) {
                currentShooterIndex += 1
            }
            break
    }

    squares[currentShooterIndex].classList.add('shooter', 'fas', 'fa-caret-up')
}

document.addEventListener('keydown', moveShooter)


function moveInvaders() {
    const leftEdge = randomInvaders[0] % width == 0
    const rightEdge = randomInvaders[randomInvaders.length - 1] % width === width - 1

    for (let i = 0; i < randomInvaders.length; i++) {

        if (squares[randomInvaders[i]] != undefined) {
            squares[randomInvaders[i]].classList.remove('invader', 'fab', 'fa-octopus-deploy')
        }

    }

    if (rightEdge && goingRight) {
        for (let i = 0; i < randomInvaders.length; i++) {
            randomInvaders[i] += width - 1
            direction = - 1
            goingRight = false
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < randomInvaders.length; i++) {
            randomInvaders[i] += width - 1
            direction = 1
            goingRight = true
        }
    }


    for (let i = 0; i < randomInvaders.length; i++) {
        randomInvaders[i] += direction
    }

    construct()

    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        health = health - 1 

        if (health === 0 || health === -1) {
            life.innerHTML = 0
            resultsDisplay.innerHTML = 'GAME OVER'
            remove()
            clearInterval(invadersId)

            document.removeEventListener('keydown', shoot)
            document.removeEventListener('keydown', moveShooter)
        } else {
            life.innerHTML = health
            remove()
            invadersRemoved = []
            randomInvaders = []
            randomizeInvaders()
        }

    }

    for (let i = 0; i < randomInvaders.length; i++) {
        if (randomInvaders[i] > currentShooterIndex) {
            health = health - 1

            if (health === 0 || health === -1) {
                life.innerHTML = 0
                resultsDisplay.innerHTML = 'GAME OVER'
                remove()

                clearInterval(invadersId)

                document.removeEventListener('keydown', shoot)
                document.removeEventListener('keydown', moveShooter)
            } else {
                life.innerHTML = health
                remove()
                invadersRemoved = []
                randomInvaders = []
                randomizeInvaders()
            }

        }

    }

    if (invadersRemoved.length === randomInvaders.length) {
        level1++
        level.innerHTML = level1
        invadersRemoved = []
        randomInvaders = []

        if(interval > 200)
        {
            interval = interval - 20
        }
        else
        {
            interval = 200
        }

        setInterval(moveInvaders, interval)
        randomizeInvaders()
    }
}

invadersId = setInterval(moveInvaders, interval)

function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex

    function moveLaser() {
        if (squares[currentLaserIndex] != undefined) {

            squares[currentLaserIndex].classList.remove('laser')
            currentLaserIndex -= width

            if (squares[currentLaserIndex] != undefined) {
                squares[currentLaserIndex].classList.add('laser')

                if (squares[currentLaserIndex].classList.contains('invader')) {
                    squares[currentLaserIndex].classList.remove('laser')
                    squares[currentLaserIndex].classList.remove('invader', 'fab', 'fa-octopus-deploy')
                    squares[currentLaserIndex].classList.add('boom', 'fab', 'fa-octopus-deploy')

                    setTimeout(() => squares[currentLaserIndex].classList.remove('boom', 'fab', 'fa-octopus-deploy'), 300)
                    clearInterval(laserId)

                    const invaderRemoved = randomInvaders.indexOf(currentLaserIndex)
                    invadersRemoved.push(invaderRemoved)
                    points++

                    score.innerHTML = "Score: " + points;
                }
            }
        }
    }

    switch (e.key) {
        case 'ArrowUp':
            laserId = setInterval(moveLaser, 100)
    }

}

document.addEventListener('keydown', shoot)
