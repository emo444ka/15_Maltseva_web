document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('playMathGame'); 

    playButton.addEventListener('click', function() {
        const numberOfProblems = 5;
        let startTime;
        let endTime;
        let correctAnswers = 0;

        function generateProblem() {
            const num1 = Math.floor(Math.random() * 100) + 1; 
            const num2 = Math.floor(Math.random() * 100) + 1; 
            return {
                question: `Сколько будет ${num1} + ${num2}?`,
                answer: num1 + num2
            };
        }

        function playGameRound(problemNumber) {
            if (problemNumber > numberOfProblems) {
                endTime = new Date();
                const timeTaken = (endTime - startTime) / 1000; 
                alert(`Игра окончена!\nВы решили ${correctAnswers} задач из ${numberOfProblems} за ${timeTaken} секунд.`);
                return;
            }

            const problem = generateProblem();
            let userAnswer = prompt(`Задача ${problemNumber}/${numberOfProblems}:\n${problem.question}`);

            if (userAnswer === null) {
                if (confirm("Вы уверены, что хотите закончить игру?")) {
                    endTime = new Date();
                    const timeTaken = (endTime - startTime) / 1000;
                    alert(`Игра прервана. Вы решили ${correctAnswers} задач из ${problemNumber - 1} за ${timeTaken} секунд.`);
                    return;
                } else {
                    playGameRound(problemNumber); 
                    return;
                }
            }

            userAnswer = userAnswer.trim();

            if (userAnswer === "") {
                alert("Вы ничего не ввели! Попробуйте еще раз.");
                playGameRound(problemNumber); 
                return;
            }

            const parsedAnswer = parseInt(userAnswer);
            if (isNaN(parsedAnswer)) {
                alert("Некорректный ввод. Введите число.");
                playGameRound(problemNumber);
                return;
            }

            if (parsedAnswer === problem.answer) {
                correctAnswers++;
                alert("Правильно!");
            } else {
                alert(`Неверно. Правильный ответ: ${problem.answer}.`);
            }

            playGameRound(problemNumber + 1); 
        }

        if (confirm("Начать игру на скорость сложения?")) {
            alert(`Вам будет предложено ${numberOfProblems} задач.\nПостарайтесь решить их как можно быстрее!`);
            startTime = new Date();
            playGameRound(1); 
        } else {
            alert("Игра отменена.");
        }
    });
});