const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.result')
const score = document.querySelector('.score')
const level = document.querySelector('.level')
const life = document.querySelector('.life')
let interval = 300
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

const invadersFormation1 = [
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
]

const invadersFormation2 = [
    17, 18, 19, 20, 21, 22,
    30, 31, 32, 37, 38, 39,
    45, 46, 47, 52, 53, 54,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
]

const invadersFormation3 = [
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    31, 32, 33, 34, 35, 36, 37, 38,
    47, 48, 49, 50, 51, 52,
    64, 65
]

const invadersFormation4 = [
    15, 19, 20, 24,
    31, 32, 33, 36, 37, 38,
    49, 50,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
]

const invadersFormation5 = [
    18, 19, 20, 21,
    31, 32, 33, 34, 35, 36, 37, 38,
    45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
    63, 64, 65, 66,
]

const invadersFormation6 = [
    15, 16, 17, 18, 19,
    35, 36, 37, 38, 39,
    50, 51, 52, 53, 54,
    60, 61, 62, 63, 64,
]

const formation = [
    invadersFormation1, invadersFormation2, invadersFormation3,
    invadersFormation4, invadersFormation5, invadersFormation6
]

randomizeInvaders()

function randomizeInvaders() {
    let randomNum = formation[Math.floor(Math.random() * formation.length)]

    for (let i = 0; i < formation.length; i++) {

        if (randomInvaders.length == 0 && randomNum.length > 0) {
            randomNum.forEach(position => {
                randomInvaders.push(position)
            });

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
        health-- 

        if (health == 0) {
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
            health--

            if (health == 0) {
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
        interval -= 10
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
            laserId = setInterval(moveLaser, 40)
    }

}

document.addEventListener('keydown', shoot)
