//Challenge 1
const surprisingFact = "The bumblebee bat is the world's smallest mammal";

console.log("LOG: ", surprisingFact);
console.error("ERROR: ", surprisingFact);

//Challenge 2
const familyTree = [
  {
    name: "Person 1",
    children: [
      {
        name: "Person 2",
        children: [
          {
            name: "Person 3",
            children: [
              {
                name: "Person 4",
              },
            ],
          },
        ],
      },
    ],
  },
];

console.log(JSON.stringify(familyTree, null, 4));

console.dir(familyTree, { depth: null, colors: true });

// Challenge 3:

function importantTask() {
  console.count("Counter");
}

importantTask();
importantTask();
importantTask();
importantTask();
console.countReset("Counter");
importantTask();
importantTask();
