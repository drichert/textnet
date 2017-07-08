var synaptic = require("synaptic")

var net = new synaptic.Architect.Perceptron(
  10, // inputs
  7,  // hidden neurons
  1   // output
)

var trainer = new synaptic.Trainer(net);

var trainingSet = [
  { input: [0,0,1,0.12,0,0,0,0,1,1],
    output: [1] },
  { input: [0,1,0,0.045,0,0,1,1,0,0],
    output: [0] },
  { input: [1,0,0,0.42,1,1,0,0,0,0],
    output: [1] }
]

var trainingOptions = {
  rate: 0.1,
  iterations: 1000,
  error: 0.005
}

trainer.train(trainingSet, trainingOptions);
