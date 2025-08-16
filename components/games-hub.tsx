"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trophy, ArrowLeft, RotateCcw } from "lucide-react"

type GameType = "menu" | "tictactoe" | "memory" | "snake" | "trivia" | "puzzle"

interface GamesHubProps {
  playerName: string
  onSendMessage?: (message: string) => void
}

export default function GamesHub({ playerName, onSendMessage }: GamesHubProps) {
  const [currentGame, setCurrentGame] = useState<GameType>("menu")
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    highScore: 0,
  })

  const handleGameComplete = useCallback(
    (won: boolean, score?: number) => {
      setGameStats((prev) => ({
        gamesPlayed: prev.gamesPlayed + 1,
        wins: prev.wins + (won ? 1 : 0),
        highScore: Math.max(prev.highScore, score || 0),
      }))

      if (won && onSendMessage) {
        onSendMessage(`🎉 I just won a game! My score: ${score || "N/A"}`)
      }
    },
    [onSendMessage],
  )

  const GameMenu = () => (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-800">🎮 Game Arcade</h2>
        <p className="text-sm text-gray-600">Choose your adventure!</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { id: "tictactoe", name: "Tic Tac Toe", icon: "⭕", desc: "Classic strategy" },
          { id: "memory", name: "Memory Cards", icon: "🧠", desc: "Test your memory" },
          { id: "snake", name: "Snake Game", icon: "🐍", desc: "Eat and grow" },
          { id: "trivia", name: "Trivia Quiz", icon: "🧩", desc: "Test your knowledge" },
        ].map((game) => (
          <Card
            key={game.id}
            className="p-3 hover:bg-blue-50 cursor-pointer transition-colors"
            onClick={() => setCurrentGame(game.id as GameType)}
          >
            <div className="text-center">
              <div className="text-2xl mb-1">{game.icon}</div>
              <div className="text-sm font-semibold">{game.name}</div>
              <div className="text-xs text-gray-500">{game.desc}</div>
            </div>
          </Card>
        ))}
      </div>

      <Separator />

      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-semibold">Your Stats</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-bold text-blue-600">{gameStats.gamesPlayed}</div>
            <div className="text-gray-600">Games</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-600">{gameStats.wins}</div>
            <div className="text-gray-600">Wins</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-purple-600">{gameStats.highScore}</div>
            <div className="text-gray-600">High Score</div>
          </div>
        </div>
      </div>
    </div>
  )

  const TicTacToe = () => {
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null))
    const [isXNext, setIsXNext] = useState(true)
    const [winner, setWinner] = useState<string | null>(null)

    const checkWinner = (squares: (string | null)[]) => {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ]
      for (const [a, b, c] of lines) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a]
        }
      }
      return null
    }

    const handleClick = (index: number) => {
      if (board[index] || winner) return

      const newBoard = [...board]
      newBoard[index] = isXNext ? "X" : "O"
      setBoard(newBoard)
      setIsXNext(!isXNext)

      const gameWinner = checkWinner(newBoard)
      if (gameWinner) {
        setWinner(gameWinner)
        handleGameComplete(gameWinner === "X", 1)
      } else if (newBoard.every((square) => square !== null)) {
        setWinner("Draw")
        handleGameComplete(false, 0)
      }
    }

    const resetGame = () => {
      setBoard(Array(9).fill(null))
      setIsXNext(true)
      setWinner(null)
    }

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setCurrentGame("menu")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h3 className="font-bold">Tic Tac Toe</h3>
          <Button variant="outline" size="sm" onClick={resetGame}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center">
          {winner ? (
            <div className="text-lg font-bold text-green-600">
              {winner === "Draw" ? "It's a draw!" : `${winner} wins!`}
            </div>
          ) : (
            <div className="text-sm">
              Next player: <span className="font-bold">{isXNext ? "X" : "O"}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
          {board.map((square, index) => (
            <button
              key={index}
              className="w-16 h-16 border-2 border-gray-300 bg-white hover:bg-gray-50 text-2xl font-bold flex items-center justify-center"
              onClick={() => handleClick(index)}
            >
              {square}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const MemoryGame = () => {
    const [cards, setCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([])
    const [flippedCards, setFlippedCards] = useState<number[]>([])
    const [moves, setMoves] = useState(0)
    const [gameWon, setGameWon] = useState(false)

    const symbols = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎺", "🎸"]

    const initializeGame = useCallback(() => {
      const gameCards = [...symbols, ...symbols]
        .sort(() => Math.random() - 0.5)
        .map((symbol, index) => ({
          id: index,
          symbol,
          flipped: false,
          matched: false,
        }))
      setCards(gameCards)
      setFlippedCards([])
      setMoves(0)
      setGameWon(false)
    }, [])

    useEffect(() => {
      initializeGame()
    }, [initializeGame])

    const handleCardClick = (cardId: number) => {
      if (flippedCards.length === 2 || cards[cardId].flipped || cards[cardId].matched) return

      const newCards = [...cards]
      newCards[cardId].flipped = true
      setCards(newCards)

      const newFlippedCards = [...flippedCards, cardId]
      setFlippedCards(newFlippedCards)

      if (newFlippedCards.length === 2) {
        setMoves(moves + 1)
        const [first, second] = newFlippedCards

        if (newCards[first].symbol === newCards[second].symbol) {
          newCards[first].matched = true
          newCards[second].matched = true
          setCards(newCards)
          setFlippedCards([])

          if (newCards.every((card) => card.matched)) {
            setGameWon(true)
            handleGameComplete(true, Math.max(0, 100 - moves))
          }
        } else {
          setTimeout(() => {
            const resetCards = [...newCards]
            resetCards[first].flipped = false
            resetCards[second].flipped = false
            setCards(resetCards)
            setFlippedCards([])
          }, 1000)
        }
      }
    }

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setCurrentGame("menu")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h3 className="font-bold">Memory Cards</h3>
          <Button variant="outline" size="sm" onClick={initializeGame}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center">
          <div className="text-sm">
            Moves: <span className="font-bold">{moves}</span>
          </div>
          {gameWon && <div className="text-lg font-bold text-green-600">You won!</div>}
        </div>

        <div className="grid grid-cols-4 gap-2 max-w-64 mx-auto">
          {cards.map((card) => (
            <button
              key={card.id}
              className={`w-14 h-14 border-2 rounded-lg text-2xl flex items-center justify-center transition-all ${
                card.flipped || card.matched
                  ? "bg-blue-100 border-blue-300"
                  : "bg-gray-200 border-gray-300 hover:bg-gray-300"
              }`}
              onClick={() => handleCardClick(card.id)}
            >
              {card.flipped || card.matched ? card.symbol : "?"}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const SnakeGame = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }])
    const [food, setFood] = useState({ x: 15, y: 15 })
    const [direction, setDirection] = useState({ x: 0, y: -1 })
    const [gameOver, setGameOver] = useState(false)
    const [score, setScore] = useState(0)
    const [gameStarted, setGameStarted] = useState(false)

    const gridSize = 20

    const resetGame = useCallback(() => {
      setSnake([{ x: 10, y: 10 }])
      setFood({ x: 15, y: 15 })
      setDirection({ x: 0, y: -1 })
      setGameOver(false)
      setScore(0)
      setGameStarted(false)
    }, [])

    const startGame = () => {
      setGameStarted(true)
    }

    useEffect(() => {
      if (!gameStarted || gameOver) return

      const gameLoop = setInterval(() => {
        setSnake((currentSnake) => {
          const newSnake = [...currentSnake]
          const head = { ...newSnake[0] }
          head.x += direction.x
          head.y += direction.y

          if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            setGameOver(true)
            handleGameComplete(false, score)
            return currentSnake
          }

          if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
            setGameOver(true)
            handleGameComplete(false, score)
            return currentSnake
          }

          newSnake.unshift(head)

          if (head.x === food.x && head.y === food.y) {
            setScore((prev) => prev + 10)
            setFood({
              x: Math.floor(Math.random() * gridSize),
              y: Math.floor(Math.random() * gridSize),
            })
          } else {
            newSnake.pop()
          }

          return newSnake
        })
      }, 150)

      return () => clearInterval(gameLoop)
    }, [gameStarted, gameOver, direction, food, score, handleGameComplete])

    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (!gameStarted || gameOver) return

        switch (e.key) {
          case "ArrowUp":
            if (direction.y === 0) setDirection({ x: 0, y: -1 })
            break
          case "ArrowDown":
            if (direction.y === 0) setDirection({ x: 0, y: 1 })
            break
          case "ArrowLeft":
            if (direction.x === 0) setDirection({ x: -1, y: 0 })
            break
          case "ArrowRight":
            if (direction.x === 0) setDirection({ x: 1, y: 0 })
            break
        }
      }

      window.addEventListener("keydown", handleKeyPress)
      return () => window.removeEventListener("keydown", handleKeyPress)
    }, [direction, gameStarted, gameOver])

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setCurrentGame("menu")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h3 className="font-bold">Snake Game</h3>
          <Button variant="outline" size="sm" onClick={resetGame}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center">
          <div className="text-sm">
            Score: <span className="font-bold">{score}</span>
          </div>
          {gameOver && <div className="text-lg font-bold text-red-600">Game Over!</div>}
          {!gameStarted && !gameOver && (
            <Button onClick={startGame} className="mt-2">
              Start Game
            </Button>
          )}
        </div>

        <div className="mx-auto" style={{ width: "300px", height: "300px" }}>
          <div className="border-2 border-gray-400 bg-green-100 relative" style={{ width: "300px", height: "300px" }}>
            {snake.map((segment, index) => (
              <div
                key={index}
                className={`absolute ${index === 0 ? "bg-green-600" : "bg-green-400"}`}
                style={{
                  left: `${segment.x * 15}px`,
                  top: `${segment.y * 15}px`,
                  width: "15px",
                  height: "15px",
                }}
              />
            ))}
            <div
              className="absolute bg-red-500 rounded-full"
              style={{
                left: `${food.x * 15}px`,
                top: `${food.y * 15}px`,
                width: "15px",
                height: "15px",
              }}
            />
          </div>
        </div>

        <div className="text-center text-xs text-gray-600">Use arrow keys to control the snake</div>
      </div>
    )
  }

  const TriviaGame = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [score, setScore] = useState(0)
    const [gameFinished, setGameFinished] = useState(false)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)

    const questions = [
      {
        question: "What year was the first iPhone released?",
        answers: ["2006", "2007", "2008", "2009"],
        correct: 1,
      },
      {
        question: "Which planet is known as the Red Planet?",
        answers: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1,
      },
      {
        question: "What is the capital of Australia?",
        answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correct: 2,
      },
      {
        question: "Who painted the Mona Lisa?",
        answers: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
        correct: 2,
      },
      {
        question: "What is the largest ocean on Earth?",
        answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correct: 3,
      },
    ]

    const handleAnswer = (answerIndex: number) => {
      setSelectedAnswer(answerIndex)
      setShowResult(true)

      if (answerIndex === questions[currentQuestion].correct) {
        setScore(score + 1)
      }

      setTimeout(() => {
        if (currentQuestion + 1 < questions.length) {
          setCurrentQuestion(currentQuestion + 1)
          setSelectedAnswer(null)
          setShowResult(false)
        } else {
          setGameFinished(true)
          handleGameComplete(
            score + (answerIndex === questions[currentQuestion].correct ? 1 : 0) >= 3,
            score + (answerIndex === questions[currentQuestion].correct ? 1 : 0),
          )
        }
      }, 1500)
    }

    const resetGame = () => {
      setCurrentQuestion(0)
      setScore(0)
      setGameFinished(false)
      setSelectedAnswer(null)
      setShowResult(false)
    }

    if (gameFinished) {
      return (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => setCurrentGame("menu")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <h3 className="font-bold">Trivia Results</h3>
            <Button variant="outline" size="sm" onClick={resetGame}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center space-y-4">
            <div className="text-6xl">{score >= 4 ? "🏆" : score >= 3 ? "🥉" : "📚"}</div>
            <div className="text-xl font-bold">
              You scored {score} out of {questions.length}!
            </div>
            <div className="text-sm text-gray-600">
              {score >= 4 ? "Excellent!" : score >= 3 ? "Good job!" : "Keep learning!"}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setCurrentGame("menu")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h3 className="font-bold">Trivia Quiz</h3>
          <div className="text-sm">
            Score: {score}/{questions.length}
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        <Card className="p-4">
          <h4 className="text-lg font-semibold mb-4">{questions[currentQuestion].question}</h4>

          <div className="space-y-2">
            {questions[currentQuestion].answers.map((answer, index) => (
              <button
                key={index}
                className={`w-full p-3 text-left border rounded-lg transition-colors ${
                  showResult
                    ? index === questions[currentQuestion].correct
                      ? "bg-green-100 border-green-500"
                      : index === selectedAnswer
                        ? "bg-red-100 border-red-500"
                        : "bg-gray-50 border-gray-300"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
              >
                {answer}
              </button>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  const renderCurrentGame = () => {
    switch (currentGame) {
      case "menu":
        return <GameMenu />
      case "tictactoe":
        return <TicTacToe />
      case "memory":
        return <MemoryGame />
      case "snake":
        return <SnakeGame />
      case "trivia":
        return <TriviaGame />
      default:
        return <GameMenu />
    }
  }

  return <div className="h-full flex flex-col">{renderCurrentGame()}</div>
}
