
import React, { useState, useEffect, useCallback } from 'react';
import { Problem, ProblemType, FeedbackStatus, HelpType } from './types';
import { generateProblem } from './utils/mathGenerator';
import { getAIHelp } from './services/geminiService';
import { AcademicCapIcon, BookOpenIcon, CheckCircleIcon, LightBulbIcon, SparklesIcon, XCircleIcon } from './components/Icons';
import HelpModal from './components/HelpModal';

const TOTAL_QUESTIONS = 10;

const App: React.FC = () => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<FeedbackStatus>(null);
  const [score, setScore] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [helpContent, setHelpContent] = useState<string>('');
  const [helpTitle, setHelpTitle] = useState<string>('');
  const [isLoadingHelp, setIsLoadingHelp] = useState<boolean>(false);
  
  const startNewGame = useCallback(() => {
    setIsGameOver(false);
    setScore(0);
    setQuestionNumber(1);
    setProblem(generateProblem());
    setUserAnswer('');
    setFeedback(null);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleNextProblem = () => {
    if (questionNumber >= TOTAL_QUESTIONS) {
      setIsGameOver(true);
    } else {
      setQuestionNumber(prev => prev + 1);
      setProblem(generateProblem());
      setUserAnswer('');
      setFeedback(null);
    }
  };

  const checkAnswer = () => {
    if (!problem || userAnswer.trim() === '' || feedback === 'correct') return;

    if (String(userAnswer).trim() === String(problem.answer)) {
      setFeedback('correct');
      if(feedback !== 'correct') { // Prevent score increase on multiple checks
        setScore(prev => prev + 1);
      }
      setTimeout(() => {
        handleNextProblem();
      }, 1500); // Auto-advance after 1.5 seconds
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1500); // Reset feedback after a bit
    }
  };

  const handleHelpRequest = async (type: HelpType) => {
    if (!problem) return;

    const titles = {
        [HelpType.EXPLAIN]: "Let's Break It Down!",
        [HelpType.HINT]: "Here's a Little Hint!",
        [HelpType.EXAMPLE]: "Let's See an Example!"
    };

    setHelpTitle(titles[type]);
    setHelpContent('');
    setIsLoadingHelp(true);
    setShowHelpModal(true);
    
    const content = await getAIHelp(type, problem);
    setHelpContent(content);
    setIsLoadingHelp(false);
  };
  
  const getFeedbackUI = () => {
    if (feedback === 'correct') {
        return (
            <div className="absolute inset-0 bg-green-100 bg-opacity-90 flex flex-col justify-center items-center rounded-2xl z-10">
                <CheckCircleIcon className="w-20 h-20 text-green-500 mb-4" />
                <p className="text-3xl font-bold text-green-700">Awesome!</p>
            </div>
        );
    }
    if (feedback === 'incorrect') {
        return (
             <div className="absolute inset-0 bg-red-100 bg-opacity-90 flex flex-col justify-center items-center rounded-2xl z-10 animate-shake">
                <XCircleIcon className="w-20 h-20 text-red-500 mb-4" />
                <p className="text-3xl font-bold text-red-700">Let's Try Again!</p>
            </div>
        )
    }
    return null;
  };

  const renderInput = () => {
    if (!problem) return null;
    
    const isExpression = problem.type === ProblemType.EXPRESSION;
    const placeholder = isExpression ? "" : "x = ?";

    return (
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (feedback !== 'correct' ? checkAnswer() : handleNextProblem())}
          placeholder={placeholder}
          className="text-4xl w-40 text-center font-bold bg-white text-gray-800 border-4 border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition placeholder-gray-300"
          disabled={feedback === 'correct'}
        />
    );
  };
  
  if (isGameOver) {
      return (
          <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
               <div className="bg-white p-10 rounded-3xl shadow-2xl">
                    <h2 className="text-5xl font-black text-yellow-500 mb-4">You did it!</h2>
                    <p className="text-2xl text-gray-700 mb-6">Your final score is:</p>
                    <p className="text-7xl font-black text-blue-600 mb-8">{score} / {TOTAL_QUESTIONS}</p>
                    <button onClick={startNewGame} className="bg-green-500 text-white font-bold text-2xl py-4 px-10 rounded-xl hover:bg-green-600 transition-transform transform hover:scale-105">
                        Play Again
                    </button>
                </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6">
      <header className="w-full max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4 flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-black text-blue-700 flex items-center">
                <SparklesIcon className="w-8 h-8 mr-2 text-yellow-400"/>
                Math Whiz Kid
            </h1>
            <div className="text-xl sm:text-2xl font-bold text-gray-600 bg-gray-100 rounded-lg px-4 py-2">
                Score: <span className="text-green-600">{score}</span>
            </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-4 overflow-hidden">
            <div className="bg-blue-500 h-4 rounded-full transition-all duration-500" style={{ width: `${(questionNumber / TOTAL_QUESTIONS) * 100}%` }}></div>
        </div>
         <p className="text-center mt-2 font-bold text-gray-500">Question {questionNumber}/{TOTAL_QUESTIONS}</p>
      </header>
      
      <main className="w-full max-w-2xl flex-grow flex flex-col justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 relative">
            {getFeedbackUI()}
            <div className="text-center">
                <p className="text-xl text-gray-500 mb-4">Solve the problem:</p>
                <div className="text-6xl md:text-7xl font-black text-gray-800 tracking-wider mb-8 flex justify-center items-center space-x-4">
                    {problem?.question.split(' ').map((part, i) => <span key={i}>{part}</span>)}
                </div>
                <div className="mb-8 h-20 flex justify-center items-center">
                    {renderInput()}
                </div>
                
                {feedback !== 'correct' ? (
                    <button onClick={checkAnswer} className="w-full md:w-auto bg-blue-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105 disabled:bg-gray-300" disabled={!userAnswer}>
                        Check Answer
                    </button>
                ) : (
                    <button onClick={handleNextProblem} className="w-full md:w-auto bg-green-500 text-white text-2xl font-bold py-4 px-12 rounded-xl hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform transform hover:scale-105 animate-pulse">
                        Next Question
                    </button>
                )}
            </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-100 rounded-2xl shadow-md">
            <h3 className="text-lg font-bold text-center text-blue-800 mb-4">Feeling Stuck? Get some help!</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button onClick={() => handleHelpRequest(HelpType.EXPLAIN)} className="flex items-center justify-center p-3 bg-white rounded-lg shadow hover:bg-yellow-50 hover:shadow-lg transition-all transform hover:-translate-y-1">
                    <BookOpenIcon className="w-6 h-6 mr-2 text-yellow-500"/>
                    <span className="font-bold text-yellow-800">Explain</span>
                </button>
                <button onClick={() => handleHelpRequest(HelpType.HINT)} className="flex items-center justify-center p-3 bg-white rounded-lg shadow hover:bg-green-50 hover:shadow-lg transition-all transform hover:-translate-y-1">
                    <LightBulbIcon className="w-6 h-6 mr-2 text-green-500"/>
                    <span className="font-bold text-green-800">Hint</span>
                </button>
                 <button onClick={() => handleHelpRequest(HelpType.EXAMPLE)} className="flex items-center justify-center p-3 bg-white rounded-lg shadow hover:bg-purple-50 hover:shadow-lg transition-all transform hover:-translate-y-1">
                    <AcademicCapIcon className="w-6 h-6 mr-2 text-purple-500"/>
                    <span className="font-bold text-purple-800">Example</span>
                </button>
            </div>
        </div>
      </main>
      <HelpModal 
        show={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title={helpTitle}
        content={helpContent}
        isLoading={isLoadingHelp}
      />
    </div>
  );
};

export default App;
