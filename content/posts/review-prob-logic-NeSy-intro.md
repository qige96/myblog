---
title: "A Review of Probabilistic Logic: NeSy - Intro"
date: 2022-08-25T15:30:42+01:00
draft: false
---

Fairly simply speaking, Neuro-Symbolic AI, or NeSy for short, refers to the AI approach that combines artificial neural networks and symbolic reasoners. NeSy research has a long history. In recent years, because of the profound success of deep neural networks in solving various AI problems, NeSy also receives great attention, as many people believe that by proper methods, the combination of the two approaches can achieve better performance than any of the pure approaches. In this section, I will present some recent research in NeSy that addressed our central question of probabilistic logic.

Nevertheless, I need to further clarify my scope. There are tons of papers on NeSy, but not all of them fall in our interests. Recall that our central question is 
$$
\phi_1^{X_1},\dots,\phi_n^{X_n}|\!\!\!\approx \psi^?
$$

Therefore, I think some of the NeSy research is highly relevant to our interests but not directly aim to solve our central question. Just to name a few:

- **DeepProbLog** is a successive research project of ProbLog. It aims to combine the low-level perception power of neural network and high-level reasoning power of logical and probabilistic representations and inference. We know that the basic element of a ProbLog program is probability-annotated logical clause. Then, where do the probabilities come from? This is a non-trivial problem in practice. DeepProbLog proposed that we can obtain the probabilities from neural networks. That's the key idea of its proposed "neural predicate". DeepProbLog did a good job in filling the gap between neural and symbolic reasoning, yet it doesn't tackle our central question: DeepProbLog help to obtain probabilities, while we assume that the probabilities are given, and we care about how to use these given probabilistic premises to compute the probability of a conclusion, and DeepProbLog did not focus on this inference part. BTW, DeepProbLog was first introduced in a NIPS conference paper[^1]. For more details, there is also a longer journal version[^2]. 

- 

In this part, I will introduce some NeSy methods that can take as input probabilistic premises and return the probabilities of a conclusion. 



[^1]: Robin Manhaeve, Sebastijan Dumancic, Angelika Kimmig, Thomas Demeester, Luc De Raedt: *DeepProbLog: Neural Probabilistic Logic Programming*. NeurIPS 2018: 3753-3763 ([paper](https://papers.nips.cc/paper/2018/hash/dc5d637ed5e62c36ecb73b654b05ba2a-Abstract.html))
[^2]: Robin Manhaeve, Sebastijan Dumancic, Angelika Kimmig, Thomas Demeester, Luc De Raedt: *Neural Probabilistic Logic Programming in DeepProbLog*. AIJ ([paper](https://www.sciencedirect.com/science/article/abs/pii/S0004370221000552))

