import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const fieldStyle = 'p-2 w-36 border outline-none';

const PLAYERS = {
  Uno: 'Uno',
  Uka: 'Uka',
};

const Field = ({ name, setName, fact, setFact, onSubmit }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className='flex flex-row space-x-2'>
        <input
          type='text'
          placeholder='Нэр'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldStyle}
        />
        <input
          type='text'
          placeholder='Факт'
          value={fact}
          onChange={(e) => setFact(e.target.value)}
          className={fieldStyle}
        />
        <button
          type='submit'
          className='h-full p-2 bg-blue-300 hover:bg-blue-500 hover:text-white transition-colors rounded shadow-md'
        >
          Оруулах
        </button>
      </div>
    </form>
  );
};

function App() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [fact1, setFact1] = useState('');
  const [fact2, setFact2] = useState('');

  const [unoFacts, setUnoFacts] = useState([]);
  const [ukaFacts, setUkaFacts] = useState([]);

  const [answersForUno, setAnswersForUno] = useState([]);
  const [answersForUka, setAnswersForUka] = useState([]);

  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentFact, setCurrentFact] = useState(null);
  const [unoPoints, setUnoPoints] = useState(0);
  const [ukaPoints, setUkaPoints] = useState(0);

  const onSubmit = (setArr, fact, name, setName, setFact) => {
    if (!name.trim() || !fact.trim()) {
      return;
    }

    setArr((prev) => [...prev, { name, fact }]);

    setName('');
    setFact('');
  };

  const startGame = () => {
    if (unoFacts.length !== ukaFacts.length || !unoFacts.length) {
      toast.error('Ижил тооны факт оруулна уу!');
      return;
    }

    setCurrentPlayer(PLAYERS.Uno);
    setCurrentFact(ukaFacts[0]);

    // Add possible answers
    const unoAnswers = [];
    const ukaAnswers = [];

    for (const fact of unoFacts) {
      ukaAnswers.push(fact.name);
    }

    for (const fact of ukaFacts) {
      unoAnswers.push(fact.name);
    }

    setAnswersForUno(unoAnswers);
    setAnswersForUka(ukaAnswers);
  };

  const endGame = () => {
    setCurrentPlayer(null);

    toast.success(
      unoPoints > ukaPoints
        ? `Uno ${unoPoints} оноотой хожлоо!`
        : unoPoints === ukaPoints
        ? `${unoPoints} оноогоор тэнцлээ`
        : `Uka ${unoPoints} оноотой хожлоо!`,
      { duration: 5000 }
    );
  };

  const guess = (guessedName) => {
    // Correct
    if (currentFact.name === guessedName) {
      toast.success('Зөв байлаа, та 10 оноо авлаа.');
      if (currentPlayer === PLAYERS.Uno) {
        setUnoPoints((prev) => prev + 10);
        setCurrentPlayer(PLAYERS.Uka);

        if (!unoFacts[0]) {
          setTimeout(() => endGame(), 100);

          return;
        }

        const filteredFacts = ukaFacts.filter(
          (ukaFact) => ukaFact.fact !== currentFact.fact
        );

        setCurrentFact(unoFacts[0]);
        setUkaFacts(filteredFacts);
      }

      if (currentPlayer === PLAYERS.Uka) {
        setUkaPoints((prev) => prev + 10);
        setCurrentPlayer(PLAYERS.Uno);

        if (!ukaFacts[0]) {
          endGame();

          return;
        }

        const filteredFacts = unoFacts.filter(
          (unoFact) => unoFact.fact !== currentFact.fact
        );

        setCurrentFact(ukaFacts[0]);
        setUnoFacts(filteredFacts);
      }
      // Wrong
    } else {
      toast.error('Буруу байлаа, та 3 оноо алдлаа.');

      if (currentPlayer === PLAYERS.Uno) {
        setUnoPoints((prev) => prev - 3);
        setCurrentPlayer(PLAYERS.Uka);

        if (!unoFacts[0]) {
          endGame();

          return;
        }

        const filteredFacts = ukaFacts.filter(
          (ukaFact) => ukaFact.fact !== currentFact.fact
        );

        setCurrentFact(unoFacts[0]);
        setUkaFacts(filteredFacts);
      }

      if (currentPlayer === PLAYERS.Uka) {
        setUkaPoints((prev) => prev - 3);
        setCurrentPlayer(PLAYERS.Uno);

        if (!ukaFacts[0]) {
          endGame();

          return;
        }

        const filteredFacts = unoFacts.filter(
          (unoFact) => unoFact.fact !== currentFact.fact
        );

        setCurrentFact(ukaFacts[0]);
        setUnoFacts(filteredFacts);
      }
    }
  };

  return (
    <div className='w-full min-h-screen bg-gray-300 flex justify-center items-center'>
      <div className='w-5/6 min-h-[30rem] rounded shadow-lg bg-white p-10'>
        {!currentPlayer ? (
          <>
            <h1 className='text-3xl font-bold mb-10'>For 6th Anniversary</h1>

            <p className='mb-10 text-gray-400 text-sm'>
              Анхаарал: Нэрнүүдийг дандаа адил бичсэн байх ёстой. Жишээ нь,
              Цогоо гээд дараа нь Цого эсвэл Tsogoo гэж болохгүй. Мөн ижил тооны
              факт оруулна уу.
            </p>

            <div className='w-full flex flex-row justify-between'>
              <div className='w-fit'>
                <p className='font-bold mb-4'>Uno</p>
                <Field
                  name={name1}
                  setName={setName1}
                  fact={fact1}
                  setFact={setFact1}
                  onSubmit={() =>
                    onSubmit(setUnoFacts, fact1, name1, setName1, setFact1)
                  }
                />
                {unoFacts.map((fact) => (
                  <p key={fact.fact} className='mt-4'>
                    {'-'.repeat(fact.fact.length)}
                  </p>
                ))}
              </div>
              <div className='w-fit'>
                <p className='font-bold mb-4'>Uka</p>
                <Field
                  name={name2}
                  setName={setName2}
                  fact={fact2}
                  setFact={setFact2}
                  onSubmit={() =>
                    onSubmit(setUkaFacts, fact2, name2, setName2, setFact2)
                  }
                />
                {ukaFacts.map((fact) => (
                  <p key={fact.fact} className='mt-4'>
                    {'-'.repeat(fact.fact.length)}
                  </p>
                ))}
              </div>
            </div>

            <hr className='my-10 border-b-4' />
            <div className='w-full flex justify-center items-center'>
              <button
                onClick={startGame}
                className='p-4 rounded-md shadow-md text-white bg-blue-500 hover:bg-blue-700'
              >
                Тоглоом эхлэх
              </button>
            </div>
          </>
        ) : (
          <div className='relative'>
            <div className='fixed top-4 right-4'>
              <p>Uno-гийн оноо: {unoPoints}</p>
              <p>Uka-гийн оноо: {ukaPoints}</p>
            </div>
            <h1 className='text-3xl font-bold mb-4'>
              Тоглогч: {currentPlayer}
            </h1>
            <h2 className='text-xl mb-4'>
              Таны одоогийн оноо:{' '}
              {currentPlayer === PLAYERS.Uno ? unoPoints : ukaPoints}
            </h2>

            <p className='p-4 border border-blue-200 mb-4'>
              {currentFact.fact}
            </p>

            <div className='flex flex-row space-x-4'>
              {currentPlayer === PLAYERS.Uno &&
                answersForUno.map((answer, i) => (
                  <button
                    key={i}
                    onClick={() => guess(answer)}
                    className='p-4 rounded-md shadow-md bg-blue-500 text-white'
                  >
                    {answer}
                  </button>
                ))}

              {currentPlayer === PLAYERS.Uka &&
                answersForUka.map((answer, i) => (
                  <button
                    key={i}
                    onClick={() => guess(answer)}
                    className='p-4 rounded-md shadow-md bg-blue-500 text-white'
                  >
                    {answer}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      <Toaster />
    </div>
  );
}

export default App;
