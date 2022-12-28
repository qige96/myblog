---
title: "Review Prob Logic NeSy KGE"
date: 2022-10-15T19:05:32+01:00
draft: false
---

Knowledge Graph (KG) is recently a popular topic in artificial intelligence, for it is considered to be a powerful representation that can provide fruitful semantic knowledge, and thus empower various advanced AI applications. **It turns out that the techniques developed in the field of knowledge graph can help to address our problem of neuro-symbolic probabilistic logic**. To begin with, I shall briefly introduce what is knowledge graph, and knowledge graph embedding. Then, I will reframe the problem of probabilistic logic to be the problem of knowledge graph embedding and triple classification.

## Knowledge Graph & Embedding

Simply speaking, Knowledge Graph is a proposed solution to express and represent knowledge in a form that both human and machines can easily understand. Usually, a KG describes the relations among individual entities and conceptual classes. Though KG has a long research history dating back to semantic network, computational ontology, etc, it was a [blog of Google](https://blog.google/products/search/introducing-knowledge-graph-things-not/) that coined the term *Knowledge Graph*. Originally, Knowledge Graph is just a name of Google's technology and product. Soon after, it became a popular research topic in knowledge representation and a broader field of artificial intelligence.

Formally speaking, a **Knowledge Graph** is a [multigraph](https://en.wikipedia.org/wiki/Multigraph), represented in a standard form of graph-structured data. The canonical data model of knowledge graph is [RDF](https://www.w3.org/RDF/). A knowledge graph $\mathcal{G}$  is a tuple $(\mathcal{E},\mathcal{R},  \mathcal{T} )$, where  $\mathcal{E}$ is a set of entities,  $\mathcal{R}$ is a set of relation types,  and  $\mathcal{T}$ is a set of relational triple $\langle s, p, o \rangle$, where $s,o\in \mathcal{E}$  are respectively the *subject* and *object* entities of the triple, and $p \in \mathcal{R}$ is the *predicate* (edge/relation) of the triple connecting subject and object.

In the 2010s, machine learning (ML), particularly deep learning (DL) got fundamental breakthroughs and developed quickly. Some researchers were thinking how to combine the techniques of machine learning and knowledge graphs. The main difficulty is that entities and relations in KGs are symbolic representation, while ML techniques mainly operate on vector representation. Hence, we need a way to convert the entities and relations of KGs into vectors.  

**Knowledge Graph Embedding** is such a family of neural network algorithms to map the entities and relations of a knowledge graph to a $m$-dimension vector space $\mathbb{R}^m$. A KG embedding model usually defines a scoring function $f(\langle \vec{s}, \vec{p}, \vec{o} \rangle)$ that evaluates the truth/correctness of a triple, where $\vec{s}, \vec{p}, \vec{o} \in \mathbb{R}^m$ are the relevant embeddings of $s, p, o$. Then the model will find the vector representation of the entities and relations that can optimise the overall scores of the function $f$.

## KG Embedding as NeSy Probabilistic Logic

When obtained the embedding of a KG, a common downstream application is triple classification. we can write the problem of triple classification as "given an existing knowledge graph, how likely is a new unknown triple being correct"
$$
\mathcal{G} |\!\!\!\approx \psi^ ?
$$
where $\mathcal{G}$ is the knowledge graph, $\psi$ is the new triple, and the question mark $?$ means the likelihood of the triple being correct. This form is the same as our central question:

$$
\phi_1^{X_1},\dots,\phi_n^{X_n}|\!\!\!\approx \psi^?
$$

Thus, we can use the techniques of KG embedding and triple classification to solve the problem of probabilistic logic, except the limitation that the premises must be the form of triples $\phi =\langle s, p, o \rangle$  or rules made of triples $\gamma = \phi_1 \leftarrow \phi_2 \land \phi_3$, rather than arbitrary logical clauses. Note that most of KG embedding algorithms, like the famous TransE, don't accept the weights of the edges, so cannot handle probabilistic knowledge graphs. Fortunately, there are a few embedding models can fit our needs, such the UKGE[^1] model.

## Uncertain Knowledge Graph Embedding

The UKGE (Uncertain Knowledge Graph Embedding) model takes as input: 

1. a probabilistic knowledge graph $\mathcal{pG} = \{(\phi_i, c_i)|\phi_i \in \mathcal{G}, c_i \in [0,1]\}$ where $c$ denotes the associated probability of the $\phi$ being true, and;
2. a set of rules $\Gamma = \{\gamma_1, ..., \gamma_k\}$  

Then, UKGE output the corresponding vector representations of the entities and relations, plus a function that predicate the probabilities of new triples $f(\phi) \in [0, 1]$. **Note** that we assume 1) there are only individual entities but no conceptual classes in $\mathcal{G}$, and 2) head of a rule $r \in \Gamma$ consist of only one triple.

For example, in $\mathcal{pG}$ we could have, 
$$
(\langle Bob, friend, Alice \rangle , 0.8) \\ 
(\langle Alice, votesFor, Labour \rangle, 0.9) \\
$$
In $\Gamma$ we could have
$$
\langle Bob, votesFor, Labour \rangle \leftarrow \langle Bob, friend, Alice \rangle \land \langle Alice, votesFor, Labour \rangle
$$
How does UKGE map the entities and relations into vectors? At first, we randomly initialise the vectors $\vec{s}, \vec{p}, \vec{o} \in \mathbb{R}^m$. Next, we define a scoring function 
$$
f(\phi)= \frac{1}{1+e^{-[\vec{p} \ \circ \ (\vec{s} \ \cdot \ \vec{o})]}}
$$
where $\cdot$ means inner product and $\circ$ means element wise multiplication. This scoring function is also the function that predict the probability of a triple being correct. One may question that this function is simply a sigmoid function that guarantee the output value to be within 0 to 1, but these outputs are not necessary probabilities. The magic for the probabilistic output comes from the training process that tunes the vectors, i.e., during training, we find the vectors $\vec{s}, \vec{p}, \vec{o} \in \mathbb{R}^m$ that not only optimise the scoring function, but also guarantee the probabilistic semantics. Here is backbone of the training process:

1. sample a set of probabilistic triples $\mathcal{L}^+ \subseteq \mathcal{pG}$ from the existing graph. Note that $\mathcal{L}^+$ should cover all the entities and relations.
2. minimise (find the best embeddings ) the loss function $J = \sum_{\phi_i \in \mathcal{L}^+} [f(\phi_i) - c_i]^2$

Easy to see that minimising the loss function $J$ is minimising the mean square error between the scores $f(\phi_i)$ and the probabilities $c_i$, so the scores $f(\phi)$ is trained to approximate probabilities of $\phi$ being correct.

So far so good. Nevertheless, the above training process does not take the rules into consideration. Therefore, here is the improved training process that forces the triples to conform the rules:

1. (the same) sample a set of probabilistic triples $\mathcal{L}^+ \subseteq \mathcal{pG}$ from the existing graph. Note that $\mathcal{L}^+$ should cover all the entities and relations.

2. create a set of unknown triples $\mathcal{L}^-$ by [negative sampling](https://pykeen.readthedocs.io/en/stable/reference/negative_sampling.html), i.e., take an existing triple  $\langle s, p, o \rangle$ and randomly replace its subject or object to create a new one $\langle s', p, o \rangle$ or $\langle s, p, o' \rangle$.
3. minimise such a loss function $J = \sum_{\phi_i \in \mathcal{L}^+} [f(\phi_i) - c_i]^2 + \sum_{\phi_j \in \mathcal{L}^-}\sum_{\gamma_k \in \Gamma_\gamma} [d_{\gamma_k}(\phi_j)]^2$

In the second term of the loss function, $d_{\gamma}(\phi_j)$ measures the loss of a triple $\phi_j$ violating the rule $\gamma_k$ (the head of rule $\gamma_k$ should be $\phi_j$). Hence, the second term means the total loss of every unknown triples violating the rules. How to define the function $d_{\gamma}(\phi)$ is a design choice. Below is the suite of definitions used by the author of UKGE brought from Lukasiewicz t-norm.
$$
I(\phi_i) = c_i, \phi_i \in \mathcal{L}^+ \\
I(\phi_i) = c_i, f(\phi_i) \in \mathcal{L}^- \\
I(\phi_i \land \phi_j) = max\{0, I(\phi_i) + I(\phi_j) − 1\} \\
I(\phi_i \lor \phi_j) = min\{1, I(\phi_i) + I(\phi_j)\} \\
I(\neg \phi_i) = 1 - I(\phi_i) \\
I(\phi_i \leftarrow \phi_j) = min\{1, 1 − I(\phi_j) + I(\phi_i)\} \\
d_{\gamma}(\phi_i) = 1 - I(\gamma) = max\{1, 1 − I(\phi_j) + I(\phi_i)\}
$$



[^1]: Chen, X., Chen, M., Shi, W., Sun, Y., & Zaniolo, C. (2019, July). Embedding uncertain knowledge graphs. In *Proceedings of the AAAI conference on artificial intelligence* (Vol. 33, No. 01, pp. 3363-3370).
