# KylieAI

An artificial intelligence that learns to traverse a maze using a genetic algorithm.

Using a genetic algorithm, the AI learns to navigate the maze through the principles of natural selection and survival of the fittest. Each generation begins with a population of agents that are randomly initialized. As they move through the maze, fitness is evaluated based on how close each agent gets to the next checkpoint while using the fewest possible moves.

The most efficient agents are selected to pass on their traits to the next generation. Every five generations, the number of allowed moves is increased to support incremental learning. This allows the AI to retain previously successful movement patterns and gradually refine its pathfinding strategy over time.

It typically takes around fifty generations for the AI to reach the first checkpoint when the evolution speed is set to six. Reaching the second checkpoint usually takes about one hundred twenty generations, with later checkpoints taking progressively longer. The learning process is slow but reliable, and the AI eventually completes the maze without missing checkpoints or dying when facing enemies. Compared to the millions of years it took for human intelligence to evolve, AdamAI simply requires patience.

<img src="https://i.imgur.com/tHDRHvM.jpeg" alt="Picture of a KylieAI in-action demonstration."/>

## Features

- The small square at the black starting point represents the fittest agent of the current generation. Press the space bar to view the entire population.

- You can adjust the population size to influence the likelihood of producing stronger agents, modify the mutation rate to control how much agents deviate from successful behaviors, and change the evolution speed to accelerate the process. A speed setting of six is recommended. You can also configure how many additional moves are granted every set number of generations, with five moves every five generations being the suggested setting.

- Press P to take control and play the maze manually. For a human, the maze is initially straightforward. However, once the AI completes it, you may find yourself making more mistakes than the trained model.

- Press G to replay notable moments from the evolutionary process.

Inspired by [Code Bullet](https://github.com/Code-Bullet)'s implementation of genetic algorithms.
