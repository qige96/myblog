---
title: "A Review of Probabilistic Logic: SRL - Problog"
date: 2022-07-31T22:35:02+01:00
draft: false
---


Problog[^1] is a probabilistic extension to the classical logic programming language Prolog. 

A problog program is a set of probabilistic facts and a set of deterministic rules. A probabilistic fact is denoted as $p::\phi$ where $\phi$ is an atom and $p$ is the probability. A rule is denoted as $h :- b_1,...,b_k$ where the head $h$ and body $b_i$ are all atoms. A rule says that $h$ is true only if all the $b$ are true. We call $h$ derived atoms, and they are required to be disjoint with probabilistic atoms $\phi$. 

Below is an example of a problog program:

```prolog
0.1::burglary.
0.2::earthquake.
0.7::hears_alarm(X) :- person(X).
person(mary).
person(john). 
alarm :- burglary.
alarm :- earthquake.
calls(X) :- alarm, hears_alarm(X).
```

Line 1-2 define two probabilistic facts. Line 4-5 define two deterministic facts that are used to define the domain of variables. Line 3 was written in the form of a "probabilistic rule "with variables, saying that if $person(X)$ is true, then $hears\_alarm(X)$ is true with a probability 0.7. However, we can see the $person(X)$ is a deterministic fact, so the body of this rule is always true, and can be grounded to be two atoms $person(mary)$ and $person(john)$. Therefore, this "probabilistic rule" is just a syntactic sugar to define two probabilistic atoms $0.7::hears\_alarm(mary)$ and $0.7::hears\_alarm(john)$. This syntactic sugar requires the body to be all deterministic facts, and all variables in the head should appear in the body. Line 6-7 define two rules, and line 8 defines one rule with variables, which also could be grounded into 2 by substituting variable $X$ by constants $mary$ and $john$.

After grounding the variables and re-writing the "probabilistic rules", we convert the example program into the following ground program:

```prolog
0.1::burglary.
0.2::earthquake.
0.7::hears_alarm(mary).
0.7::hears_alarm(john).
% after grounding the deterministic facts can be omitted
% person(mary). 
% person(john). 
alarm :- burglary.
alarm :- earthquake.
calls(mary) :- alarm, hears_alarm(mary).
calls(john) :- alarm, hears_alarm(john).
```

A problog program defines a probability distribution over possible worlds. This is similar to what we did in Nilsson's Probabilistic Logic, with one exception that lies in how we interpret rules. In Nilsson's Probabilistic Logic, or even in classical propositional logic and first-order logic, when we see an implication $P \rightarrow Q$, it is valid for $Q$ to be true when $P$ is false. In other words, $P \rightarrow Q$ is equivalent to $\neg P \lor Q$ in propositional or first-order logic. However, in logic programming, it is NOT valid for $Q$ to be true when $P$ is false. In other words, $P \rightarrow Q$ is equivalent to $(P \land Q) \lor (\neg P \land \neg Q)$ in logic programming. 

All the probabilistic facts together form all the possible worlds. In the above example, 4 probabilistic facts form $2^4=16$ possible worlds. In each possible world, a fact $\phi$ can be true with probability $p$, or false with probability $1-p$. Problog makes an important assumption: each probabilistic fact is independent of others. Thus, the probability of a possible world equals the product of the probabilities of the probabilistic choices.

$$
Pr(\boldsymbol{x}) =\prod_{\{p_i|\boldsymbol{x}\vDash\phi_i\}}p_i \prod_{\{p_i|\boldsymbol{x}\nvDash\phi_j\}}(1-p_j)
$$

Below are all the possible worlds and their corresponding probabilities. Each row represent a possible world. An atom is true if it is listed in the row, or considered false if not shown.

![Possible worlds](/images/problog-worlds.png)

With a problog program, the central question can be tackled in a straightforward way, by just identifying all the possible worlds in which $\psi$ is true, then sum up the probabilities of these possible worlds: $Pr(\psi)=\sum_{\{\boldsymbol{x} |\boldsymbol{x} \vDash\psi \}}Pr(\boldsymbol{X}=\boldsymbol{x})$. 

For example, to calculate the probability of $\psi=calls(mary)$ being true, we identify that it is true in possible world 1, 3, 5, 7, 9, 11, 13, 15. Then, the probability is 

$$
Pr(\psi)=\sum_{i=1}^{1,3,5,7,9,11} Pr(\boldsymbol{x}_i)=0.0098+0.0042+0.0392+0.0168+0.0882+0.0378=0.196
$$

As other SRL theories, Problog can do more than answering the central question. such as computing the conditional probability of a formula given some observations, or working our the most probable explanation(possible world) given some of the probabilistic facts being observed. Problog also comes with some parameter learning algorithms that learn the probabilities of the probabilistic facts from tranning data.  Interested readers should refer to the original paper and subsequent publications.

[^1]: D. Fierens, G. Van den Broeck, J. Renkens, D. Shterionov, B. Gutmann, I. Thon, G. Janssens and L. De Raedt. *Inference and learning in probabilistic logic programs using weighted Boolean formulas.* Theory and Practice of Logic Programming, 15:3, pp. 358 - 401, Cambridge University Press, 2015.

[^2]: De Raedt, L., & Kimmig, A. (2015). Probabilistic (logic) programming concepts. *Machine Learning*, *100*(1), 5-47.


