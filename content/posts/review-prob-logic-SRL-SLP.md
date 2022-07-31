---
title: "A Review of Probabilistic Logic: SRL - SLP"
date: 2022-07-31T22:39:49+01:00
draft: false
---


The last SRL theory I would like to introduce here is Stochasitc Logic Program[^1] (SLP). 

Similar to Problog, Stochastic Logic Programs is also a probabilistic extesion of classic logic programs. However, SLP is different from Problog, in particular the semantics. So far, the probabilistic logic we had introduced are based on possible world semantics. That is, the probability value assigned to a proposition indicates "the probability of the proposition being true". While in SLP, the probability value assigned to a proposition indicates "the probability of a proposition being selected in one step of a proof". Therefore, we cannot directly apply SLP to our central question, but need some prepocessing jobs. 

Below is an example of how a Stochastic Logic Program looks like

```prolog
0.3:p(a).
0.7:p(b).
0.2:q(a).
0.8:q(b).
0.4:s(X) :- p(X), P(X).
0.6:s(X) :- q(X).
```
In the above example, we see similar syntax as Problog: there are facts and rules, and probabilities. A significant differences is, in Problog, rules are deterministic, but in SLP, rules can be assigned with parameters. What's more, another requirement of SLP is that the parameters of clauses whose heads share the same predicate symbol sum to one. In the abve example, we can see line 1 and line 2 share the same predicate symbol *p*, line 3 and line 4 share *q*, and the heads of line 5 and line 6 share the same predicate symbol *s*.
Such kind of program, where every clause is assigned with a parameter value, and the parameters of clauses whose heads share the same predicate symbol sum to one, is called pure normalised SLP, and the parameters can be regarded as probabilities. There are SLPs of which not every clause is assigne a parameter, and the parameter may not sum to 1. These SLPs are impure, and unnormalised. We focus on pure, normalised SLPs because they are simple, and usually, impure unnormalised SLPs can be converted into pure, normalised ones. In Poblog, it is no problem to have both $0.9::p(a). \ 0.9::p(b)$. However, in pure normalised SLP, it is not allowed because $p(a), \ p(b)$ is the head of the clause, and share the same predicate symbol. The probabilities of $p(a), \ p(b)$ must sum to 1.

With an pure normalised SLP, we can use it to calculate the probability of a derived conclusion (that is derivable from that SLP). For instance, given the above example SLP, what's the probability of $s(X)$? Syntactally, this problem takes the form of 

$$
\phi_1^{X_1},\dots,\phi_n^{X_n}|\!\!\!\approx \psi^Y
$$

This looks the same as our central question. But we should bear in mind that the resulting probability $Y$ is not indicating the probability of the conclusion $\psi$ being correct, but the probability of the conclusion $\psi$ being .

To compute $Y$ is simple. We first prove the query $\psi$. There might be multiple feasible proofs. $Y$ is the sum of the probabilities of all the feasible proofs to $\psi$. One proof to $\psi$ is a sequence of selecting the applicable clauses in the SLP. Each selection is a stochastic choice according to the assigned probabilities. The probability of a proof is the product of the probabilities of these selections. All the proofs can be organised as a proof tree. Below is an illusration using the above example SLP to prove the query $s(X)$. In the tree, every path from the root node to a leaf node is a proof, whether successful or failed. Here, we examine the rightmost path: to prove $s(X)$, selecting line, 6 we need to prove $q(X)$

![SLP tree](images/SLP-tree.png)



Formally, we say the successful proof, i.e., the path ended with $\square$, to be a refutation, denoted as $r = \langle c_i, ..., c_j \rangle$, a sequence of selected clauses. Then, all the feasible proofs of a query is denoted as $R(G)$ where $G$ is the query, or the Goal of the proofs. Then, given a Stochastic Logic Program $S$ and a goal $G$, the probability distribution over the refutations is defined as 

$$
P_{S,G}(r) = \frac{\prod_{c \in r} p_c}{Z}
$$ 

where $Z = \sum_{r \in R(G)} \prod_{c \in r} p_c$ is just a normalising constant.

We know that the probabilities of SLP have different meanings of Problog, and other probabilistic logics introuced before. Then, where can we apply SLP? 


Though the probabilities of clauses in a SLP are not saying the correctness or truth for that clause, we can derive those probabilities of this meaning. The key idea is to regard the body of a clause as an explanation of the head[^2]. For example, here is a simple SLP:

```prolog
0.6:s(X) :- p(X).
0.4:s(X) :- q(X).
```
In this simple SLP, we see 3 predicate symbols $s, p, q$, and one variable $X$. Suppose the domain of this SLP is two constants $\{a, b\}$, and $Pr[s(a)] = 0.8, \ Pr[s(b)] = 0.2$ what's the probability of $p(a), p(b), q(a), q(b)$?

If we observed $s(a)$ occur, then by line 1, we have an explanation that "$s(a)$ orrur because $p(a)$ occur", with probability 0.6. By Closed World Assumption, we also have $\neg q(a)$ because $q(a)$ is not explicitly stated. Thus, we have the following conditinal probability $Pr[p(a), \neg q(a)|s(a)] = 0.6$

Similarly, we have 

$$
Pr[\neg p(a),  q(a)|s(a)] = 0.4
$$

$$
Pr[p(a),  q(a)|s(a)] = 0
$$

$$
Pr[p(b), \neg q(b)|s(b)] = 0.4
$$

$$
Pr[\neg p(b),  q(b)|s(b)] = 0.6
$$

$$
Pr[\neg p(b),  q(b)|s(b)] = 0
$$

And thus:

$$
Pr[p(a), \neg q(a), s(a)] = Pr[p(a), \neg q(a)| s(a)] * Pr[s(a)] = 0.6*0.8=0.48
$$

$$
Pr[p(a), \neg q(a), s(a)] = Pr[p(a), \neg q(a)| s(a)] * Pr[s(a)] = 0.6*0.8=0.48
$$

$$
Pr[p(a), \neg q(a), s(a)] = Pr[p(a), \neg q(a)| s(a)] * Pr[s(a)] = 0.6*0.8=0.48
$$

$$
Pr[p(a), \neg q(a), s(a)] = Pr[p(a), \neg q(a)| s(a)] * Pr[s(a)] = 0.6*0.8=0.48
$$



[^1]: Cussens, J. *Parameter Estimation in Stochastic Logic Programs*. Machine Learning 44, 245–271 (2001). [https://doi.org/10.1023/A:1010924021315](https://doi.org/10.1023/A:1010924021315)

[^2]: Chen, J., Muggleton, S. & Santos, J. *Learning probabilistic logic models from probabilistic examples*. Mach Learn 73, 55–85 (2008). [https://doi.org/10.1007/s10994-008-5076-4](https://doi.org/10.1007/s10994-008-5076-4)


