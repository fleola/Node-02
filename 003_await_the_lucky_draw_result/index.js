function luckyDraw(player) {
  return new Promise((resolve, reject) => {
    const win = Boolean(Math.round(Math.random()));

    process.nextTick(() => {
      if (win) {
        resolve(`${player} won a prize in the draw!`);
      } else {
        reject(new Error(`${player} lost the draw.`));
      }
    });
  });
}

const getResults = async () => {
  //in questo modo gestiamo ogni Rejection
  const results = await Promise.allSettled([
    luckyDraw("Tina"),
    luckyDraw("Jorge"),
    luckyDraw("Julien"),
  ]);
  console.log(results);
};

getResults();
